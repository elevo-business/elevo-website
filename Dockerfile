FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
# Cache-Bust VOR dem COPY: invalidiert die folgenden Layer (COPY . . und den
# Build) zwangsweise. Ohne das hat Coolify/BuildKit den gesamten Build aus dem
# Cache genommen (15-Sekunden-Build) und das alte dist ohne Video ausgeliefert.
# Bei jeder relevanten Aenderung den Wert hochzaehlen.
ARG CACHEBUST=2026-06-23-vsl-v6-team
RUN echo "cachebust=${CACHEBUST}"
COPY . .
RUN bun run build && \
    echo "=== BUILD-VERIFIKATION ===" && \
    ls -la /app/dist/team/ && \
    test -f /app/dist/team/hero-vsl.mp4 && \
    grep -q '<video' /app/dist/vertriebssystem/index.html && \
    echo "OK: Video + mp4 im dist vorhanden"

FROM nginx:alpine AS runtime
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Hard-Fail, falls das Artefakt doch kein Video enthaelt -> kein kaputter Deploy.
RUN test -f /usr/share/nginx/html/team/hero-vsl.mp4 && \
    grep -q '<video' /usr/share/nginx/html/vertriebssystem/index.html && \
    echo "RUNTIME OK: Video ausgeliefert"
EXPOSE 80
