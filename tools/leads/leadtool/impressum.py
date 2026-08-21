"""Impressum-Auswertung — nur oeffentlich zugaengliche Angaben.

Regeln, die hier fest verdrahtet sind:
- robots.txt wird gelesen und respektiert.
- Hoefliches Crawlen: eigener User-Agent mit Kontaktadresse, Timeout, Pause
  zwischen Domains (Aufrufer), maximal zwei Seiten pro Domain, kein Tiefen-Crawl.
- Es wird nie eine Exception nach aussen geworfen: jeder Fehler landet als Status
  in der Ausgabe und der Lauf geht weiter.
- Es werden keine Adressen geraten und kein Bot-Schutz umgangen.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Any
from urllib.parse import unquote, urljoin, urlparse
from urllib.robotparser import RobotFileParser

import httpx
from bs4 import BeautifulSoup

# Reihenfolge = Prioritaet bei der Linksuche
IMPRESSUM_MARKER = ("impressum", "imprint", "legal", "kontakt")

FUNKTIONS_PRAEFIXE = {
    "info", "kontakt", "contact", "office", "buero", "büro", "mail", "email",
    "e-mail", "service", "zentrale", "sekretariat", "verwaltung", "anfrage",
    "anfragen", "post", "hallo", "moin", "team", "empfang", "bewerbung",
    "karriere", "jobs", "presse", "marketing", "vertrieb", "sales", "support",
    "datenschutz", "impressum", "webmaster", "noreply", "no-reply", "web",
    "willkommen", "beratung", "planung", "technik", "buchhaltung", "rechnung",
    "einkauf", "personal", "hr", "contactus", "anfrage-web",
}

DATEI_ENDUNGEN = (
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".css", ".js", ".ico",
)

MUELL_DOMAINS = (
    "example.com", "example.org", "domain.de", "musterfirma.de", "sentry.io",
    "wixpress.com", "godaddy.com", "yourdomain.com", "email.com",
    "website.com", "ihre-domain.de", "meine-domain.de", "deinedomain.de",
)

EMAIL_REGEX = re.compile(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9\-]+(?:\.[A-Za-z0-9\-]+)+")

ANSPRECHPARTNER_REGEX = re.compile(
    r"(?:Vertretungsberechtigte[rns]*\s+Gesch[äa]ftsf[üu]hrer(?:in)?"
    r"|Vertreten\s+durch"
    r"|Gesch[äa]ftsf[üu]hrer(?:in)?"
    r"|Gesch[äa]ftsf[üu]hrung"
    r"|Inhaber(?:in)?"
    r"|Geschaeftsfuehrer(?:in)?)"
    r"\s*[:\-–]?\s*(.{2,90})",
    re.IGNORECASE,
)

# Nach diesen Woertern hoert der Name auf
ANSPRECHPARTNER_STOPP = re.compile(
    r"\b(Registergericht|Handelsregister|Umsatzsteuer|USt|Ust|Steuernummer|Sitz|"
    r"Telefon|Tel\.|Fax|E-?Mail|Amtsgericht|HRB|HRA|Adresse|Anschrift|"
    r"Verantwortlich|Redaktion|Aufsichtsbeh|Berufsbezeichnung|Kammer)\b",
    re.IGNORECASE,
)

HANDELSREGISTER_REGEX = re.compile(
    r"\b(HRB|HRA|GnR|PR|VR)\s*[:\-]?\s*(\d{1,7})\s*([A-Za-z]{0,3})\b"
)

ADRESSE_REGEX = re.compile(
    r"([A-ZÄÖÜ][A-Za-zÄÖÜäöüß.\-]*(?:[ \-][A-Za-zÄÖÜäöüß.\-]+){0,3}"
    r"(?:stra(?:ss|ß|s)e|str\.|weg|allee|platz|gasse|ring|damm|ufer|chaussee|hof|park)"
    r"\s+\d{1,4}\s*[a-zA-Z]?)"
    r"[,\s]+(?:D-)?(\d{5})\s+"
    r"([A-ZÄÖÜ][A-Za-zÄÖÜäöüß.\-]+(?:[ \-][A-ZÄÖÜ][A-Za-zÄÖÜäöüß.\-]+){0,3})",
    re.IGNORECASE,
)


@dataclass
class ImpressumErgebnis:
    status: str = "nicht_versucht"
    impressum_url: str = ""
    emails: list[str] = field(default_factory=list)
    ansprechpartner: str = ""
    postanschrift: str = ""
    handelsregister: str = ""

    def as_dict(self) -> dict[str, Any]:
        return {
            "status": self.status,
            "impressum_url": self.impressum_url,
            "emails": self.emails,
            "ansprechpartner": self.ansprechpartner,
            "postanschrift": self.postanschrift,
            "handelsregister": self.handelsregister,
        }

    @classmethod
    def from_dict(cls, daten: dict[str, Any]) -> "ImpressumErgebnis":
        return cls(
            status=daten.get("status", ""),
            impressum_url=daten.get("impressum_url", ""),
            emails=list(daten.get("emails") or []),
            ansprechpartner=daten.get("ansprechpartner", ""),
            postanschrift=daten.get("postanschrift", ""),
            handelsregister=daten.get("handelsregister", ""),
        )


def domain_von_url(url: str) -> str:
    netloc = urlparse(url if "://" in url else f"http://{url}").netloc.lower()
    netloc = netloc.split("@")[-1].split(":")[0]
    return netloc[4:] if netloc.startswith("www.") else netloc


def entschleiern(text: str) -> str:
    """Uebliche Verschleierungen aufloesen — kein Raten, nur Ersetzen."""
    ersetzungen = [
        (r"\s*\(\s*(?:at|ät)\s*\)\s*", "@"),
        (r"\s*\[\s*(?:at|ät)\s*\]\s*", "@"),
        (r"\s*\{\s*(?:at|ät)\s*\}\s*", "@"),
        (r"(?<=[\w.\-])\s+(?:at|ät)\s+(?=[\w.\-]+\s*(?:\.|\(|\[)?)", "@"),
        (r"\s*\(\s*(?:punkt|dot)\s*\)\s*", "."),
        (r"\s*\[\s*(?:punkt|dot)\s*\]\s*", "."),
        (r"\s*\{\s*(?:punkt|dot)\s*\}\s*", "."),
        (r"(?<=[\w\-])\s+(?:punkt|dot)\s+(?=[\w\-])", "."),
    ]
    for muster, ersatz in ersetzungen:
        text = re.sub(muster, ersatz, text, flags=re.IGNORECASE)
    return text


def emails_aus_text(text: str) -> list[str]:
    gefunden: list[str] = []
    for treffer in EMAIL_REGEX.findall(entschleiern(text)):
        adresse = treffer.strip().strip(".,;:()[]<>").lower()
        if adresse.endswith(DATEI_ENDUNGEN):
            continue
        if any(muell in adresse for muell in MUELL_DOMAINS):
            continue
        if "@2x" in adresse or adresse.count("@") != 1:
            continue
        lokal, _, host = adresse.partition("@")
        if not lokal or "." not in host or len(host.rsplit(".", 1)[-1]) < 2:
            continue
        if adresse not in gefunden:
            gefunden.append(adresse)
    return gefunden


# Teilwoerter fuer zusammengesetzte Funktionsadressen
# (z. B. barrierefreiheitserklaerung@, rechnungseingang@)
FUNKTIONS_TEILWOERTER = (
    "barrierefrei", "datenschutz", "impressum", "bewerb", "karriere", "rechnung",
    "buchhaltung", "newsletter", "anmeldung", "abmeldung", "kontakt", "info",
    "empfang", "zentrale", "office", "sales", "vertrieb", "support", "service",
    "anfrage", "auftrag", "angebot", "presse", "marketing", "einkauf", "personal",
    "ausbildung", "praktikum", "schulung", "seminar", "disposition", "verwaltung",
    "sekretariat", "beschwerde", "hinweisgeber", "compliance", "webmaster",
    "noreply", "no-reply", "mailbox", "postfach", "recruiting", "jobs",
)


def normalisiere_emails(emails: list[str]) -> list[str]:
    """Prozent-Kodierung aufloesen und dedupliziert zurueckgeben. Idempotent."""
    ergebnis: list[str] = []
    for eintrag in emails:
        for adresse in emails_aus_text(unquote(eintrag)):
            if adresse not in ergebnis:
                ergebnis.append(adresse)
    return ergebnis


def email_typ(email: str) -> str:
    """personen / funktion — als Kennzeichnung des Personenbezugs.

    Im Zweifel 'personen': lieber beim Sichten einmal zu viel hinschauen.
    """
    if not email:
        return "leer"
    lokal = email.partition("@")[0].lower()
    basis = re.split(r"[+]", lokal)[0]
    if basis in FUNKTIONS_PRAEFIXE or basis.replace("-", "") in FUNKTIONS_PRAEFIXE:
        return "funktion"
    if any(teil in basis for teil in FUNKTIONS_TEILWOERTER):
        return "funktion"
    return "personen"


# Funktionspostfaecher, die zwar echt sind, aber nicht fuer eine Erstansprache
# taugen — die stehen hinten an.
NACHRANGIGE_PRAEFIXE = (
    "datenschutz", "impressum", "bewerb", "karriere", "jobs", "presse",
    "webmaster", "barrierefrei", "hinweisgeber", "compliance", "recruiting",
    "noreply", "no-reply", "abmeldung", "beschwerde", "rechnung", "buchhaltung",
)


def primaeradresse(emails: list[str]) -> str:
    """Die Adresse fuer die Erstansprache auswaehlen.

    Reihenfolge: gewoehnliches Funktionspostfach (info@, kontakt@), dann
    nachrangige Funktionspostfaecher (datenschutz@), zuletzt personenbezogene
    Adressen. Es wird nichts geraten — nur sortiert.
    """
    if not emails:
        return ""

    def rang(adresse: str) -> tuple[int, int]:
        lokal = adresse.partition("@")[0].lower()
        nachrangig = any(lokal.startswith(p) for p in NACHRANGIGE_PRAEFIXE)
        person = email_typ(adresse) == "personen"
        return (1 if nachrangig else 0, 1 if person else 0)

    return sorted(emails, key=rang)[0]


ROLLE = (
    r"(?:Gesch[äa]ftsf[üu]hrende[rn]?\s+Gesellschafter(?:in)?"
    r"|Pers[öo]nlich\s+haftende[rn]?\s+Gesellschafter(?:in)?"
    r"|Gesch[äa]ftsf[üu]hrer(?:in)?|Gesch[äa]ftsf[üu]hrung"
    r"|Inhaber(?:in)?|Vorstandsvorsitzende[rn]?|Vorstand|Aufsichtsrat"
    r"|Vertreten\s+durch|Vors\.)"
)

# Wortalternativen brauchen eine Wortgrenze, sonst frisst "die" den Anfang von
# "Dietmar" und "der" den von "Dierk".
_VORNE = re.compile(
    r"^(?:[&,;/]\s*"
    r"|(?:und|sowie|die|der|den|das|dem|vertreten\s+durch|" + ROLLE + r")"
    r"(?=$|[\s:\-–,])\s*[:\-–,]?\s*)",
    re.IGNORECASE,
)
_HINTEN = re.compile(r"[,;/(]?\s*" + ROLLE + r"\s*\)?\s*$", re.IGNORECASE)
_NUR_ROLLE = re.compile(r"^[\s(:\-–]*" + ROLLE + r"[\s):\-–.]*$", re.IGNORECASE)


TITEL = (
    r"(?:Dipl\.?(?:-|\s)?[A-Za-zÄÖÜäöüß.]*|Dr\.(?:-Ing\.)?|Prof\.|Ing\.|"
    r"M\.?Sc\.?|B\.?Sc\.?|M\.?A\.?|MBA|LL\.M\.|\(FH\)|Bauwesen|"
    r"Architekt(?:in)?|Kaufmann|Kauffrau)"
)
NUR_TITEL = re.compile(rf"(?:{TITEL}[\s,.-]*)+", re.IGNORECASE)
# Namenspartikel, die klein geschrieben sein duerfen
PARTIKEL = {"von", "van", "de", "der", "den", "zu", "zur", "am", "und"}


def saeubern_ansprechpartner(wert: str) -> str:
    """Rollenbezeichnungen und Fuellwoerter abschneiden. Idempotent."""
    if not wert:
        return ""
    vorher = None
    while vorher != wert:
        vorher = wert
        wert = _VORNE.sub("", wert)
        wert = _HINTEN.sub("", wert)
        wert = wert.strip(" .,;:-–|/()")
    # Angebrochene Klammer aus dem Kappen der Fundstelle: "Christian Scholz (CEO"
    if wert.count("(") > wert.count(")"):
        wert = wert[: wert.rindex("(")].strip(" ,;-")
    wert = re.sub(r"^(?:Herrn|Herr|Frau)\s+", "", wert, flags=re.IGNORECASE)
    # Anreden auch zwischen zwei Namen entfernen ("X und Herr Y")
    wert = re.sub(r"\b(?:Herrn|Herr|Frau)\s+", "", wert, flags=re.IGNORECASE)
    # Haengendes Bindewort am Ende ("Sven Stoye und")
    wert = re.sub(r"\s+(?:und|sowie|&|,)\s*$", "", wert, flags=re.IGNORECASE)
    if not wert or _NUR_ROLLE.match(wert) or len(wert) < 4:
        return ""
    if len(wert.split()) < 2:  # Einzelwoerter sind fast immer Extraktionsmuell
        return ""
    if NUR_TITEL.fullmatch(wert):  # nur akademische Grade, kein Name
        return ""
    # Ein klein beginnendes Wort heisst fast immer: vorne abgeschnitten
    # ("tmar Deunert"). Lieber leer als ein falscher Name in der Anrede.
    tokens = [w for w in re.split(r"[\s,]+", wert) if w]
    if any(w[0].islower() and w.lower() not in PARTIKEL for w in tokens):
        return ""
    return wert


def ansprechpartner_aus_text(text: str) -> str:
    treffer = ANSPRECHPARTNER_REGEX.search(text)
    if not treffer:
        return ""
    rohwert = treffer.group(1)
    zeilen = [z.strip() for z in rohwert.split("\n") if z.strip()]
    rohwert = zeilen[0] if zeilen else ""
    # "Geschaeftsfuehrerin:\nDipl.-Kauffrau (FH)\nSaskia Prenzel" — steht in der
    # ersten Zeile nur ein Titel, gehoert der Name der naechsten Zeile dazu.
    if len(zeilen) > 1 and NUR_TITEL.fullmatch(rohwert):
        rohwert = f"{rohwert} {zeilen[1]}"
    stopp = ANSPRECHPARTNER_STOPP.search(rohwert)
    if stopp:
        rohwert = rohwert[: stopp.start()]
    rohwert = re.sub(r"\s+", " ", rohwert).strip(" .,;:-–|/")
    if len(rohwert) < 3 or len(rohwert) > 70:
        return ""
    if EMAIL_REGEX.search(rohwert) or re.search(r"\d{4,}", rohwert):
        return ""
    return saeubern_ansprechpartner(rohwert)


def handelsregister_aus_text(text: str) -> str:
    treffer = HANDELSREGISTER_REGEX.search(text)
    if not treffer:
        return ""
    art, nummer, zusatz = treffer.groups()
    return f"{art.upper()} {nummer}{(' ' + zusatz.upper()) if zusatz else ''}".strip()


def postanschrift_aus_text(text: str) -> tuple[str, str, str]:
    """(strasse, plz, ort) — leer, wenn nichts Eindeutiges gefunden wurde."""
    treffer = ADRESSE_REGEX.search(text)
    if not treffer:
        return "", "", ""
    strasse, plz, ort = (re.sub(r"\s+", " ", g).strip(" ,") for g in treffer.groups())
    return strasse, plz, ort


class ImpressumCrawler:
    def __init__(
        self,
        user_agent: str,
        timeout: float = 10.0,
        max_seiten_pro_domain: int = 2,
    ) -> None:
        self.user_agent = user_agent
        self.max_seiten = max_seiten_pro_domain
        self._client = httpx.Client(
            timeout=timeout,
            follow_redirects=True,
            headers={
                "User-Agent": user_agent,
                "Accept-Language": "de-DE,de;q=0.9",
            },
        )
        self._robots: dict[str, RobotFileParser | None] = {}

    def close(self) -> None:
        self._client.close()

    def __enter__(self) -> "ImpressumCrawler":
        return self

    def __exit__(self, *_exc: object) -> None:
        self.close()

    # -- robots.txt ------------------------------------------------------

    def _robots_parser(self, basis: str) -> RobotFileParser | None:
        if basis in self._robots:
            return self._robots[basis]
        parser: RobotFileParser | None = RobotFileParser()
        try:
            antwort = self._client.get(urljoin(basis, "/robots.txt"))
            if antwort.status_code == 200 and antwort.text.strip():
                parser.parse(antwort.text.splitlines())  # type: ignore[union-attr]
            else:
                parser = None  # keine robots.txt = kein Verbot
        except httpx.HTTPError:
            parser = None
        self._robots[basis] = parser
        return parser

    def darf_abrufen(self, url: str) -> bool:
        teile = urlparse(url)
        basis = f"{teile.scheme}://{teile.netloc}"
        parser = self._robots_parser(basis)
        if parser is None:
            return True
        try:
            return parser.can_fetch(self.user_agent, url)
        except Exception:
            return True

    # -- Abruf -----------------------------------------------------------

    def _hole(self, url: str) -> tuple[str | None, str, str]:
        """(html, status, finale_url) — wirft nie."""
        try:
            antwort = self._client.get(url)
        except httpx.TimeoutException:
            return None, "timeout", url
        except httpx.TooManyRedirects:
            return None, "redirect_schleife", url
        except httpx.HTTPError:
            return None, "verbindungsfehler", url
        except Exception:
            return None, "abruffehler", url

        if antwort.status_code != 200:
            return None, f"http_{antwort.status_code}", str(antwort.url)
        if "html" not in antwort.headers.get("content-type", "").lower():
            return None, "kein_html", str(antwort.url)
        return antwort.text, "ok", str(antwort.url)

    @staticmethod
    def _impressum_link(html: str, basis_url: str) -> str:
        suppe = BeautifulSoup(html, "html.parser")
        kandidaten: dict[str, str] = {}
        for link in suppe.find_all("a", href=True):
            href = str(link["href"]).strip()
            if not href or href.startswith(("mailto:", "tel:", "javascript:", "#")):
                continue
            text = link.get_text(" ", strip=True).lower()
            for marker in IMPRESSUM_MARKER:
                if marker in href.lower() or marker in text:
                    kandidaten.setdefault(marker, urljoin(basis_url, href))
                    break
        for marker in IMPRESSUM_MARKER:
            if marker in kandidaten:
                return kandidaten[marker]
        return ""

    @staticmethod
    def _auswerten(html: str, url: str) -> ImpressumErgebnis:
        suppe = BeautifulSoup(html, "html.parser")
        for tag in suppe(["script", "style", "noscript"]):
            tag.decompose()

        text = suppe.get_text("\n", strip=True)

        emails: list[str] = []
        for link in suppe.select('a[href^="mailto:"]'):
            roh = str(link.get("href", ""))[7:].split("?")[0]
            for adresse in emails_aus_text(roh):
                if adresse not in emails:
                    emails.append(adresse)
        for adresse in emails_aus_text(text):
            if adresse not in emails:
                emails.append(adresse)

        strasse, plz, ort = postanschrift_aus_text(text)
        postanschrift = f"{strasse}, {plz} {ort}".strip(", ") if plz else ""

        return ImpressumErgebnis(
            status="ok",
            impressum_url=url,
            emails=normalisiere_emails(emails),
            ansprechpartner=ansprechpartner_aus_text(text),
            postanschrift=postanschrift,
            handelsregister=handelsregister_aus_text(text),
        )

    def auswerten(self, website: str) -> ImpressumErgebnis:
        """Eine Domain auswerten. Maximal self.max_seiten Inhaltsseiten."""
        if not website:
            return ImpressumErgebnis(status="keine_website")

        startseite = website if "://" in website else f"https://{website}"
        teile = urlparse(startseite)
        basis = f"{teile.scheme}://{teile.netloc}"

        if not self.darf_abrufen(startseite):
            return ImpressumErgebnis(status="robots_disallow")

        seiten = 0
        html, status, finale_url = self._hole(startseite)
        seiten += 1
        if html is None:
            return ImpressumErgebnis(status=status)

        link = self._impressum_link(html, finale_url)
        if not link:
            link = urljoin(basis, "/impressum")

        if seiten >= self.max_seiten:
            # Seitenbudget schon aufgebraucht: nur die Startseite auswerten.
            ergebnis = self._auswerten(html, finale_url)
            ergebnis.status = "ok_nur_startseite"
            ergebnis.impressum_url = ""
            return ergebnis

        if not self.darf_abrufen(link):
            return ImpressumErgebnis(status="robots_disallow")

        imp_html, imp_status, imp_url = self._hole(link)
        seiten += 1
        if imp_html is None:
            # Startseite trotzdem auswerten — viele kleine Seiten haben die
            # Angaben im Footer.
            ergebnis = self._auswerten(html, finale_url)
            ergebnis.status = f"impressum_{imp_status}"
            ergebnis.impressum_url = ""
            return ergebnis

        ergebnis = self._auswerten(imp_html, imp_url)
        if not ergebnis.emails:
            # Fallback auf die Startseite, ohne zusaetzlichen Abruf.
            ergebnis.emails = self._auswerten(html, finale_url).emails
            if ergebnis.emails:
                ergebnis.status = "ok_email_von_startseite"
        return ergebnis
