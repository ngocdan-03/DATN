#!/bin/sh
set -e

echo "=== Debug: checking /etc/secrets/ ==="
ls -la /etc/secrets/ || echo "Directory /etc/secrets/ not found"

if [ -f /etc/secrets/truststore_base64.txt ]; then
  echo "=== Found truststore_base64.txt, decoding... ==="
  base64 -d /etc/secrets/truststore_base64.txt > /app/truststore.jks
  echo "=== Decode done, checking result ==="
  ls -la /app/truststore.jks
else
  echo "=== truststore_base64.txt NOT FOUND in /etc/secrets/ ==="
fi

exec java -jar app.jar