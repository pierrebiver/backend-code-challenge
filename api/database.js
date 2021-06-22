import mongo from "mongodb";

const uri = "mongodb://localhost:27017/?poolSize=20&writeConcern=majority";
const client = new mongo.MongoClient(uri,);

let collection;

export async function connectDatabase() {
    try {
        await client.connect();
        collection = await client.db("gan-integrity").collection("cities");
    } catch (e) {
        console.error(e);
    }
}

export async function findAllCitiesBut(from) {
    return collection.find({guid: {$ne: from}}, {projection: {guid: 1, longitude: 1, latitude:1, address: 1}}).toArray();
}

export async function findAll() {
    return collection.find();
}

export function closeDatabaseConnection() {
    return client.close();
}

export async function findCityByTag(tag, isActive) {
    return collection.find({tags: tag, isActive}).toArray();
}

export async function findByIds(guids) {
    return collection.find({guid: {$in: guids}}).toArray();
}