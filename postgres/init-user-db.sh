#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE USER samuel WITH PASSWORD 'senha123';
  CREATE DATABASE pedidos;
  GRANT ALL PRIVILEGES ON DATABASE pedidos TO samuel;
EOSQL
