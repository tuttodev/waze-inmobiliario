#!/bin/bash

echo "⏳ Creando bucket local en LocalStack..."

aws --endpoint-url=http://localhost:4566 \
    s3 mb s3://waze-inmobiliario-uploads || true

echo "✅ Bucket creado (o ya existía): waze-inmobiliario-uploads"
