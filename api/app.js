import {verifyAuthorization} from "./middleware.js";
import {connectDatabase, closeDatabaseConnection, findCityByTag, findByIds, findAll} from "./database.js";
import express from "express";
import boolParser from 'express-query-boolean';
import {getDistanceInKm} from "./distance.js";
import {initializeQueue} from "./queue.js";
import {toJsonArrayTransform} from "./json-array-transform.js";

const app = express()
const port = 8080

await connectDatabase();

const channel = await initializeQueue();

app.use(boolParser());

app.get('/cities-by-tag', verifyAuthorization, async (req, res) => {
    const {tag, isActive} = req.query;
    const cities = await findCityByTag(tag, isActive);

    return res.json({cities});
});

app.get('/distance', verifyAuthorization, async (req, res) => {
    const {from, to} = req.query;
    const [cityFrom] = await findByIds([from]);
    const [cityTo] = await findByIds([to]);

    const distance = getDistanceInKm(cityFrom.latitude, cityFrom.longitude, cityTo.latitude, cityTo.longitude);

    return res.json({from: cityFrom, to: cityTo, unit: "km", distance})
});

app.get('/area', verifyAuthorization, (req, res) => {
    const {from, distance} = req.query;

    channel.sendToQueue('area',
        Buffer.from(JSON.stringify({from, distance: parseInt(distance)})), {
            correlationId: "2152f96f-50c7-4d76-9e18-f7033bd14428",
            replyTo: "area-result"
        });

    res.status(202).json({resultsUrl: 'http://127.0.0.1:8080/area-result/2152f96f-50c7-4d76-9e18-f7033bd14428'});
});

app.get('/area-result/:id', verifyAuthorization, async (req, res) => {
    const id = req.params.id;
    let cities;
    await channel.consume("area-result", (message) => {
        if (message.properties.correlationId === id) {
            cities = JSON.parse(message.content.toString());
        }

    }, {noAck: false});

    if (cities) {
        return res.json({cities});
    }

    return res.sendStatus(202);
});

app.get('/all-cities', verifyAuthorization, async (req, res) => {
    const cursor = await findAll();
    let firstChunk = true;
    const transform = (chunk) => {
        let comma = ',';
        if (firstChunk) {
            comma = '';
            firstChunk = false;
        }
        return `${comma}${JSON.stringify(chunk)}`
    };

    cursor.transformStream({transform}).pipe(toJsonArrayTransform).pipe(res);
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})

process.on('SIGINT', async () => {
    await closeDatabaseConnection();
});
process.on('SIGTERM', async () => {
    await closeDatabaseConnection();
});