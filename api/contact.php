<?php
/**
 * Server-seitiger Lead-Proxy für das Elevo-Kontaktformular.
 *
 * Warum: Pipedrive-Token und Meta-CAPI-Token dürfen NICHT im öffentlichen JS
 * stehen (sonst kann jeder das CRM fluten oder fremde Conversions melden).
 * Dieses PHP nimmt den Submit von src/components/ContactForm.astro entgegen
 * und ruft Pipedrive + Meta serverseitig auf – die Tokens bleiben hier.
 *
 * Deployment: eigener PHP-Container auf Coolify, ausgeliefert unter
 *   https://api.elevo.solutions/api/contact  (siehe api/Dockerfile + api/.htaccess)
 * Die Website liegt auf elevo.solutions → CROSS-ORIGIN, daher CORS unten.
 *
 * Token-Quelle (in dieser Reihenfolge):
 *   1) Umgebungsvariable (empfohlen, in Coolify als Env-Var setzen)
 *   2) Secret-Datei OBERHALB des Webroots (nicht im Repo, nicht per URL erreichbar)
 *   3) leer → der jeweilige Schritt wird still übersprungen
 */

// Keine PHP-Warnungen in die JSON-Antwort lecken lassen.
@ini_set('display_errors', '0');

// ---- CORS (Website und API liegen auf verschiedenen Subdomains) ----
$ALLOWED_ORIGINS = array(
  'https://elevo.solutions',
  'https://www.elevo.solutions',
  'https://relaunch.elevo.solutions',
);
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origin, $ALLOWED_ORIGINS, true)) {
  header('Access-Control-Allow-Origin: ' . $origin);
}
header('Vary: Origin');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Max-Age: 86400');

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Preflight des Browsers (JSON-POST cross-origin) → leer + 204 beantworten.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

function respond($ok, $msg = '') {
  http_response_code($ok ? 200 : 400);
  echo json_encode(array('success' => $ok, 'message' => $msg));
  exit;
}

// Nur POST zulassen (Ausnahme: Selbsttest per GET mit Schlüssel).
$SELFTEST_OK = (isset($_GET['selftest']) && $_GET['selftest'] === 'elevo-diag-2026');
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && !$SELFTEST_OK) {
  respond(false, 'Method not allowed');
}

/**
 * Liest eine Secret-Datei. Bevorzugt OBERHALB des Webroots, damit der Token
 * niemals über die URL abrufbar ist; Doc-Root nur als Fallback (per .htaccess gesperrt).
 */
function read_secret_file($filename) {
  $paths = array(
    __DIR__ . '/../../' . $filename,  // oberhalb des Webroots → NICHT per URL erreichbar
    __DIR__ . '/../' . $filename,
    __DIR__ . '/' . $filename,        // im api-Ordner (Fallback, per .htaccess gesperrt)
  );
  foreach ($paths as $p) {
    if (@is_readable($p)) { return trim(@file_get_contents($p)); }
  }
  return '';
}

// ---- Pipedrive-Token laden (serverseitig) ----
$API_TOKEN = getenv('PIPEDRIVE_API_TOKEN');
if (!$API_TOKEN) { $API_TOKEN = read_secret_file('pipedrive-token.txt'); }
$BASE = 'https://api.pipedrive.com/v1';

// ---- Meta Conversions API: Config laden (serverseitig) ----
// Pixel-ID darf öffentlich sein; der Access-Token NICHT → nur ENV/Datei hier.
$META_PIXEL_ID = getenv('META_PIXEL_ID');
if (!$META_PIXEL_ID) { $META_PIXEL_ID = read_secret_file('meta-pixel-id.txt'); }
$META_CAPI_TOKEN = getenv('META_CAPI_TOKEN');
if (!$META_CAPI_TOKEN) { $META_CAPI_TOKEN = read_secret_file('meta-capi-token.txt'); }
$META_TEST_EVENT_CODE = getenv('META_TEST_EVENT_CODE'); // optional, nur zum Testen im Events Manager
if (!$META_TEST_EVENT_CODE) { $META_TEST_EVENT_CODE = read_secret_file('meta-test-code.txt'); }

// ---- HTTP-Helfer (cURL, mit file_get_contents-Fallback) ----
function http_post_json($url, $payload) {
  $body = json_encode($payload);
  if (function_exists('curl_init')) {
    $ch = curl_init($url);
    curl_setopt_array($ch, array(
      CURLOPT_POST => true,
      CURLOPT_POSTFIELDS => $body,
      CURLOPT_HTTPHEADER => array('Content-Type: application/json'),
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_TIMEOUT => 15,
    ));
    $res = curl_exec($ch);
    curl_close($ch);
    return json_decode($res, true);
  }
  $ctx = stream_context_create(array('http' => array(
    'method' => 'POST',
    'header' => "Content-Type: application/json\r\n",
    'content' => $body,
    'timeout' => 15,
  )));
  return json_decode(@file_get_contents($url, false, $ctx), true);
}

// ---- Selbsttest (GET ?selftest=elevo-diag-2026): Config-Status, KEINE Secrets ----
if ($SELFTEST_OK) {
  // CAPI live testen: ein harmloses 'SelfTest'-Event SENDEN.
  $capiValid = null; $capiError = '';
  if ($META_CAPI_TOKEN !== '' && $META_PIXEL_ID !== '' && function_exists('curl_init')) {
    $payload = array('data' => array(array(
      'event_name'    => 'SelfTest',
      'event_time'    => time(),
      'action_source' => 'website',
      'event_id'      => 'selftest_' . time(),
      'user_data'     => array(
        'client_ip_address' => isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '0.0.0.0',
        'client_user_agent' => isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : 'selftest',
        'em'                => array(hash('sha256', 'selftest@elevo.solutions')),
      ),
    )));
    $u = 'https://graph.facebook.com/v19.0/' . $META_PIXEL_ID . '/events?access_token=' . urlencode($META_CAPI_TOKEN);
    $j = http_post_json($u, $payload);
    if (is_array($j) && isset($j['events_received'])) { $capiValid = true; }
    else { $capiValid = false; $capiError = isset($j['error']['message']) ? $j['error']['message'] : 'unbekannte Antwort'; }
  }
  // Pipedrive-Token live testen (GET /users/me) → erkennt rotierten/ungültigen Token
  $pdValid = null; $pdError = '';
  if ($API_TOKEN !== '') {
    $pu = $BASE . '/users/me?api_token=' . urlencode($API_TOKEN);
    if (function_exists('curl_init')) {
      $ch2 = curl_init($pu);
      curl_setopt_array($ch2, array(CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 10));
      $pr = curl_exec($ch2); curl_close($ch2);
    } else { $pr = @file_get_contents($pu); }
    $pj = json_decode($pr, true);
    if (is_array($pj) && !empty($pj['success'])) { $pdValid = true; }
    else { $pdValid = false; $pdError = isset($pj['error']) ? $pj['error'] : 'ungültig/keine Antwort'; }
  }
  echo json_encode(array(
    'ok'                    => true,
    'pixel_id_set'          => $META_PIXEL_ID !== '',
    'capi_token_loaded'     => $META_CAPI_TOKEN !== '',
    'capi_token_valid'      => $capiValid,
    'capi_error'            => $capiError,
    'pipedrive_token_loaded'=> $API_TOKEN !== '',
    'pipedrive_token_valid' => $pdValid,
    'pipedrive_error'       => $pdError,
    'test_code_active'      => $META_TEST_EVENT_CODE !== '',
    'curl'                  => function_exists('curl_init'),
    'allow_url_fopen'       => (bool) ini_get('allow_url_fopen'),
  ));
  exit;
}

// ---- Eingabe lesen (JSON-Body) ----
$raw = file_get_contents('php://input');
$in = json_decode($raw, true);
if (!is_array($in)) { $in = $_POST; }

function field($in, $name) {
  return isset($in[$name]) ? trim((string)$in[$name]) : '';
}

// Honeypot: echte Nutzer füllen dieses Feld nie aus.
if (field($in, '_hp') !== '') { respond(true, 'ok'); }

$name      = field($in, 'name');
$email     = field($in, 'email');
$telefon   = field($in, 'phone');
$company   = field($in, 'company');
$serviceKey= field($in, 'service');
$nachricht = field($in, 'message');
$source    = field($in, 'source');   // i. d. R. 'elevo.solutions'

// Meta Conversions API (Dedup + Matching)
$eventId        = field($in, 'event_id');
$eventSourceUrl = field($in, 'event_source_url');
$fbp            = field($in, 'fbp');
$fbc            = field($in, 'fbc');

// ---- Validierung ----
if ($name === '' || $email === '' || $nachricht === '') {
  respond(false, 'Pflichtfelder fehlen');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  respond(false, 'E-Mail ungültig');
}
// Einfache Spam-Heuristik: Namen mit URLs sind praktisch immer Bots.
if (preg_match('~https?://|www\.~i', $name)) {
  respond(true, 'ok'); // stillschweigend verwerfen
}

// Vor-/Nachname aus dem einzelnen Namensfeld ableiten (für Pipedrive + CAPI-Matching).
$nameParts = preg_split('/\s+/', $name, 2);
$vorname  = isset($nameParts[0]) ? $nameParts[0] : $name;
$nachname = isset($nameParts[1]) ? $nameParts[1] : '';

// ---- Service-Auswahl → Label (serverseitig, damit nicht fälschbar) ----
$SERVICE_MAP = array(
  'funnel-check'    => 'Kostenloser Funnel-Check',
  'system'          => 'Das 14-Tage Klienten-System',
  'website'         => 'Conversion-Website',
  'automatisierung' => 'Terminbuchung & Follow-up-Automatisierung',
  'sonstiges'       => 'Etwas anderes',
);
$serviceLabel = isset($SERVICE_MAP[$serviceKey]) ? $SERVICE_MAP[$serviceKey] : '(nicht angegeben)';

/**
 * Sendet das 'Lead'-Event an die Meta Conversions API (serverseitig).
 * E-Mail/Telefon/Name werden SHA-256-gehasht (Meta-Pflicht). event_id sorgt für
 * Deduplizierung mit dem Browser-Pixel. Best-effort: Fehler brechen den Flow nicht ab.
 */
function meta_send_lead($pixelId, $token, $version, $eventId, $sourceUrl, $email, $telefon, $vorname, $nachname, $fbp, $fbc, $customData, $testCode) {
  if (!$pixelId || !$token) { return; }

  $ud = array();
  if ($email !== '')   { $ud['em'] = array(hash('sha256', strtolower(trim($email)))); }
  if ($telefon !== '') {
    // Auf Ziffern reduzieren und grob nach E.164 (DE = +49) normalisieren.
    $d = preg_replace('/\D+/', '', $telefon);
    if (strpos($d, '00') === 0)      { $d = substr($d, 2); }
    elseif (strpos($d, '0') === 0)   { $d = '49' . substr($d, 1); }
    if ($d !== '') { $ud['ph'] = array(hash('sha256', $d)); }
  }
  if ($vorname !== '')  { $ud['fn'] = array(hash('sha256', strtolower(trim($vorname)))); }
  if ($nachname !== '') { $ud['ln'] = array(hash('sha256', strtolower(trim($nachname)))); }
  if ($fbp !== '') { $ud['fbp'] = $fbp; }
  if ($fbc !== '') { $ud['fbc'] = $fbc; }
  if (!empty($_SERVER['REMOTE_ADDR']))     { $ud['client_ip_address'] = $_SERVER['REMOTE_ADDR']; }
  if (!empty($_SERVER['HTTP_USER_AGENT']))  { $ud['client_user_agent'] = $_SERVER['HTTP_USER_AGENT']; }

  $event = array(
    'event_name'    => 'Lead',
    'event_time'    => time(),
    'action_source' => 'website',
    'user_data'     => $ud,
    'custom_data'   => $customData,
  );
  if ($eventId !== '')   { $event['event_id'] = $eventId; }
  if ($sourceUrl !== '') { $event['event_source_url'] = $sourceUrl; }

  $body = array('data' => array($event));
  if ($testCode) { $body['test_event_code'] = $testCode; }

  $url = 'https://graph.facebook.com/' . $version . '/' . $pixelId . '/events?access_token=' . urlencode($token);
  http_post_json($url, $body);
}

// ---- 1) Pipedrive: Person anlegen ----
if ($API_TOKEN !== '') {
  $personData = array(
    'name'  => $name,
    'email' => array(array('value' => $email, 'primary' => true, 'label' => 'work')),
  );
  if ($telefon !== '') {
    $personData['phone'] = array(array('value' => $telefon, 'primary' => true, 'label' => 'work'));
  }
  $personRes = http_post_json($BASE . '/persons?api_token=' . urlencode($API_TOKEN), $personData);
  if (empty($personRes['success']) || empty($personRes['data']['id'])) {
    respond(false, 'CRM-Fehler');
  }
  $personId = $personRes['data']['id'];

  // ---- 2) Lead anlegen (Service-Tag im Titel) ----
  $title = '[Elevo] ' . $serviceLabel . ' — ' . $name;
  $leadData = array('title' => $title, 'person_id' => $personId);
  $leadRes = http_post_json($BASE . '/leads?api_token=' . urlencode($API_TOKEN), $leadData);
  $leadId = (!empty($leadRes['success']) && !empty($leadRes['data']['id'])) ? $leadRes['data']['id'] : null;

  // ---- 3) Notiz mit allen Anfrage-Daten ----
  $noteLines = array('Quelle: Kontaktformular (' . ($source !== '' ? $source : 'elevo.solutions') . ').');
  $noteLines[] = 'Anliegen: ' . $serviceLabel;
  if ($company !== '')   { $noteLines[] = 'Coaching / Marke: ' . $company; }
  if ($telefon !== '')   { $noteLines[] = 'Telefon / WhatsApp: ' . $telefon; }
  if ($nachricht !== '') { $noteLines[] = '— — —'; $noteLines[] = 'Nachricht: ' . $nachricht; }

  $noteData = array('content' => implode("\n", $noteLines), 'person_id' => $personId);
  if ($leadId) { $noteData['lead_id'] = $leadId; }  // an den Lead hängen → im Lead sichtbar
  http_post_json($BASE . '/notes?api_token=' . urlencode($API_TOKEN), $noteData);
}

// ---- 4) Meta Conversions API: 'Lead' serverseitig melden (Dedup via event_id) ----
$customData = array(
  'currency'     => 'EUR',
  'value'        => 0,
  'content_name' => $serviceLabel,
  'lead_source'  => $source !== '' ? $source : 'elevo.solutions',
);
// Klick-ID (fbc) aus dem fbclid der Anzeigen-URL bauen, falls der Pixel
// geblockt war und kein _fbc-Cookie gesetzt wurde → sonst keine Ad-Zuordnung.
if ($fbc === '' && $eventSourceUrl !== '') {
  $q = parse_url($eventSourceUrl, PHP_URL_QUERY);
  if ($q) {
    parse_str($q, $qs);
    if (!empty($qs['fbclid'])) {
      $fbc = 'fb.1.' . round(microtime(true) * 1000) . '.' . $qs['fbclid'];
    }
  }
}

meta_send_lead($META_PIXEL_ID, $META_CAPI_TOKEN, 'v19.0', $eventId, $eventSourceUrl, $email, $telefon, $vorname, $nachname, $fbp, $fbc, $customData, $META_TEST_EVENT_CODE);

respond(true, 'ok');
