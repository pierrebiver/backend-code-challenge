import {verifyAuthorization} from "./middleware.js";
import {connectDatabase, closeConnection, findCityByTag, findById} from "./database.js";
import express from "express";
import boolParser from 'express-query-boolean';
import {getDistanceInKm} from "./distance.js";

const app = express()
const port = 8080

await connectDatabase();

app.use(boolParser());

app.get('/cities-by-tag', verifyAuthorization, async (req, res) => {
    const {tag, isActive} = req.query;
    const cities = await findCityByTag(tag, isActive);

    return res.json({cities});
});

app.get('/distance', verifyAuthorization, async (req, res) => {
    const {from, to} = req.query;
    const cityFrom = await findById(from);
    const cityTo = await findById(to);

    const distance = getDistanceInKm(cityFrom.latitude, cityFrom.longitude, cityTo.latitude, cityTo.longitude);

    return res.json({from: cityFrom, to: cityTo, unit: "km", distance})
});

app.get('/area', verifyAuthorization, (req, res) => {

});

app.get('/all-cities', verifyAuthorization, (req, res) => {

})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})

process.on('SIGINT', closeConnection);
process.on('SIGTERM', closeConnection);