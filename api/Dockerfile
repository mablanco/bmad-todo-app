# Stage 1: Install dependencies
FROM python:3.12-slim AS builder

WORKDIR /build
COPY pyproject.toml .
COPY app/ ./app/

RUN pip install --no-cache-dir --prefix=/install . \
    && find /install -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true \
    && find /install -type d -name tests -exec rm -rf {} + 2>/dev/null || true

# Stage 2: Runtime
FROM python:3.12-slim

RUN useradd --create-home --shell /bin/bash appuser \
    && pip uninstall -y pip setuptools wheel 2>/dev/null || true \
    && rm -rf /var/cache/apt /var/lib/apt/lists/* /root/.cache

WORKDIR /app

COPY --from=builder /install /usr/local
COPY app/ ./app/
COPY migrations/ ./migrations/
COPY alembic.ini .

RUN mkdir -p /app/data \
    && printf '#!/usr/bin/env python3\nimport urllib.request, sys\ntry:\n    r = urllib.request.urlopen("http://localhost:8000/api/v1/health")\n    sys.exit(0 if r.status == 200 else 1)\nexcept Exception:\n    sys.exit(1)\n' > /app/healthcheck.py \
    && chmod +x /app/healthcheck.py \
    && chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python /app/healthcheck.py

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
