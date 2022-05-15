import {connectDatabase, findAll, findByIds, findCityByTag} from "./database.js";
import {initializeQueue} from "./queue.js";
import {getDistanceInKm} from "./distance.js";
import {v4} from "uuid";

await connectDatabase();

const channel = await initializeQueue();

const allCities = async () => {
    return await findAll();
}

const citiesByTag = async ({tag, isActive}) => {
    return await findCityByTag(tag, isActive);
}

const distance = async ({from, to}) => {
    const [cityFrom] = await findByIds([from]);
    const [cityTo] = await findByIds([to]);
    const distance = getDistanceInKm(cityFrom.latitude, cityFrom.longitude, cityTo.latitude, cityTo.longitude);
    return {from: cityFrom.guid, to: cityTo.guid, unit: "km", distance};
}

const triggerAreaCalculation = async ({from, distance}) => {
    const uuid = v4();
    channel.sendToQueue('area',
        Buffer.from(JSON.stringify({from, distance: parseInt(distance)})), {
            correlationId: uuid,
            replyTo: "area-result"
        });

    return uuid;
}

const areaResult = async (id) => {
    let cities = [];
    await channel.get("area-result", (message) => {
        if (message.properties.correlationId === id) {
            cities = JSON.parse(message.content.toString());
        }

    }, {noAck: true});

    return cities;
}

export const resolvers = {
    Query: {
        allCities: (_, args) => allCities(),
        citiesByTag: (_, args) => citiesByTag(args),
        distance: (_, args) => distance(args),
        triggerAreaCalculation: (_, args) => triggerAreaCalculation(args),
        areaResult: (_, args) => areaResult(args)
    }
}
