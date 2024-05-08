#!/bin/bash
docker-compose exec totem-postgres psql -U totem -d totem -f seeder.sql
