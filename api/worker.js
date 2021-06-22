import throng from 'throng';
import schedule from 'node-schedule';
import {closeDatabaseConnection, connectDatabase, findAllCitiesBut, findByIds} from "./database.js";
import {initializeQueue} from "./queue.js";
import {getDistanceInKm} from "./distance.js";

await connectDatabase();

const channel = await initializeQueue();

async function start() {
    schedule.scheduleJob('5 * * * * *', async () => {
        await channel.consume("area", async function reply(message) {
            const {from, distance} = JSON.parse(message.content.toString());
            const citiesInArea = await findCitiesInArea(from, distance);
            channel.sendToQueue(message.properties.replyTo,
                Buffer.from(JSON.stringify(citiesInArea)), {
                    correlationId: message.properties.correlationId
                });

            channel.ack(message);
        });
    });
}

async function findCitiesInArea(from, distance) {
    const [city] = await findByIds([from]);
    const cities = await findAllCitiesBut(from);
    const citiesInArea = cities.filter((c) => getDistanceInKm(c.latitude, c.longitude, city.latitude, city.longitude) <= distance);

    return citiesInArea;
}

throng({start});

process.on('SIGINT', async () => {
    await closeDatabaseConnection();
});
process.on('SIGTERM', async () => {
    await closeDatabaseConnection();
});