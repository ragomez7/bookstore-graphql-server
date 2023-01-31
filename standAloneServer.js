import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import BookstoreAPI from "./dataSources/bookstoreAPI.js";
import typeDefs from "./schema.js";
import resolvers from "./resolvers.js";

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const { url } = await startStandaloneServer(server, {
    context: async ({ req, res }) => {
        const { cache } = server;
        return {
            dataSources: {
                bookstoreAPI: new BookstoreAPI({ cache })
            },
            authScope: req.headers
            // 
        }
    },
    listen: { port: 4001 }
});
console.log(`GraphQL Server Running at ${url}`)