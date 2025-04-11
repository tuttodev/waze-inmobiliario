#!/bin/bash
export $(grep -v '^#' .env | xargs)

# Ejecuta el comando que le pases después
$@
