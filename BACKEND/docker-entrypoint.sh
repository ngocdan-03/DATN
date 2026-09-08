#!/bin/sh
set -e

if [ -f /etc/secrets/truststore_base64.txt ]; then
  base64 -d /etc/secrets/truststore_base64.txt > /app/truststore.jks
fi

exec java -jar app.jar