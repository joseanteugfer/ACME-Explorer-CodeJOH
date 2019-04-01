#!/bin/bash
mongoimport --db ACME-Explorer --collection actors --file data/actors.json
mongoimport --db ACME-Explorer --collection trips --file data/trips.json
mongoimport --db ACME-Explorer --collection orderedtrips --file data/orderedtrips.json
mongoimport --db ACME-Explorer --collection configs --file data/configs.json
mongoimport --db ACME-Explorer --collection findercaches --file data/findercaches.json

