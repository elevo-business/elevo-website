FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
# Cache-Bust VOR dem COPY: invalidiert die folgenden Layer (COPY . . und den
# Build) zwangsweise. Ohne das hat Coolify/BuildKit den gesamten Build aus dem
# Cache genommen (15-Sekunden-Build) und das alte dist ohne Video ausgeliefert.
# Bei jeder relevanten Aenderung den Wert hochzaehlen.
ARG CACHEBUST=2026-06-23-vsl-v7-buildinfo
RUN echo "cachebust=${CACHEBUST}"
COPY . .
RUN bun run build && \
    { echo "CACHEBUST=${CACHEBUST}"; date -u; echo "--- dist/team/ ---"; ls -la /app/dist/team/; echo "--- ls public/team (Quelle) ---"; ls -la /app/public/team/; } > /app/dist/_buildinfo.txt && \
    cat /app/dist/_buildinfo.txt

FROM nginx:alpine AS runtime
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Build-Marker auch im Runtime-Image bestaetigen (nicht fatal, nur Log).
RUN echo "=== RUNTIME dist/team ===" && ls -la /usr/share/nginx/html/team/ && cat /usr/share/nginx/html/_buildinfo.txt
EXPOSE 80
