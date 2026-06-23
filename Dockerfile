FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
# Cache-Bust: erzwingt Neuausfuehrung von `bun run build` auch bei aggressiv
# cachender Build-Pipeline (Coolify/BuildKit). Bei jeder Code-Aenderung den
# Wert nach unten erhoehen, damit der Layer-Hash sich aendert.
ARG CACHEBUST=2026-06-23-vsl-v3
RUN echo "build=${CACHEBUST}" > /app/.cachebust && bun run build && \
    echo "=== dist/vsl/ ===" && ls -la /app/dist/vsl/ 2>&1 || echo "WARNUNG: dist/vsl/ FEHLT im Build!" && \
    echo "=== <video> in vertriebssystem/index.html ===" && grep -c '<video' /app/dist/vertriebssystem/index.html

FROM nginx:alpine AS runtime
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Verifikation zur Build-Zeit, damit ein Fehlen sofort im Build-Log sichtbar wird.
RUN ls -la /usr/share/nginx/html/vsl/ && grep -c '<video' /usr/share/nginx/html/vertriebssystem/index.html
EXPOSE 80
