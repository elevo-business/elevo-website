# Eigenständiger PHP-Container für api.elevo.solutions (Lead-Proxy + Meta CAPI).
# Wird als SEPARATE Coolify-App deployt (Base Directory: "api").
# Die Marketing-Website (elevo.solutions) bleibt davon unberührt static/nginx.
FROM php:8.3-apache

# mod_rewrite für /api/contact-Routing, headers für CORS-Header.
RUN a2enmod rewrite headers \
  && sed -ri 's!AllowOverride None!AllowOverride All!g' /etc/apache2/apache2.conf

# API-Dateien unter /api/ ausliefern → Endpoint: https://<host>/api/contact
COPY . /var/www/html/api/

# Secret-Dateien (Tokens) gehören NICHT ins Image — per Coolify-Env-Var setzen:
#   PIPEDRIVE_API_TOKEN, META_CAPI_TOKEN, META_PIXEL_ID, (optional) META_TEST_EVENT_CODE

EXPOSE 80
