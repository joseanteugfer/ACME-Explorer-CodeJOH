#!/bin/bash
BASE_SITE=acme-explorer.com

# Instruction to up development enviroment 
export NODE_ENV=development
export PORT=8008
export DBPORT=27018
export DBHOST=mongo
export VIRTUAL_HOST=$NODE_ENV.$BASE_SITE
docker-compose -p $VIRTUAL_HOST up -d --build

# Instruction to up production enviroment 
export NODE_ENV=production
export PORT=8001
export DBPORT=27011
export DBHOST=mongo
export VIRTUAL_HOST=$BASE_SITE
docker-compose -p $VIRTUAL_HOST up -d --build
