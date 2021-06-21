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

export function closeConnection() {
    return client.close();
}

export async function findCityByTag(tag, isActive) {
    return collection.find({tags: tag, isActive}).toArray();
}

export async function findById(guid) {
    return collection.findOne({guid});
}