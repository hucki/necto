#!/bin/bash
# TODO: setup context like described here: https://www.docker.com/blog/how-to-deploy-on-remote-docker-hosts-with-docker-compose/

docker-compose build

for img in $(docker-compose config | awk '{if ($1 == "image:") print $2;}'); do
  images="$images $img"
done

echo $images


docker image save $images | docker -H "ssh://user@serverIp" image load
docker-compose -H "ssh://user@serverIp" up --force-recreate -d
docker-compose -H "ssh://user@serverIp" logs -f
read -p "Press any key to continue... " -n1 -s