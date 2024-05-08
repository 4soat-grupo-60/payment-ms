#!/bin/bash

docker-compose build --no-cache
sleep 5
docker-compose up -d