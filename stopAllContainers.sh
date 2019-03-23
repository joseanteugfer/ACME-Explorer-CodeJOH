#!/bin/bash
docker stop $(docker container ps -aq)
docker rm $(docker container ps -aq)