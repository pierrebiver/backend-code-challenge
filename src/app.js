import {ApolloServer} from "apollo-server";
import {typeDefs} from "./type-defs.js";
import {resolvers} from "./resolvers.js";
import {closeDatabaseConnection} from "./database.js";
import {closeQueueConnection} from "./queue.js";
import {verifyAuthorization} from "./middleware.js";

const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
});

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});


process.on('SIGINT', async () => {
    await closeDatabaseConnection();
    closeQueueConnection();
});
process.on('SIGTERM', async () => {
    await closeDatabaseConnection();
    closeQueueConnection();
});