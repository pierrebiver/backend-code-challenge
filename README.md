# GAN Integrity backend code challenge

## Pre-requisite
 You only need to have node and docker (with docker-compose) installed on your machine

## How to launch the script
-  run ``docker-compose up -d ``
- run ``npm run init-db`` to initalize mongodb with the cities
- run ``npm run web-service``
- run ``npm run worker``
- then finally ``npm run start``


## What could be improved
- as we deal with coordinates and cities, we could use mongo Geospatial features to perform geo spatial queries.
- the "area-result" endpoint send by default a 202 if the queue system is not done processing. But it could be that 
  the worker never started the process in the first place, or crashed. So it would be nice to have the queue knowing 
  what process are actually in progress. 