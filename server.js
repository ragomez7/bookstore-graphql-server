import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ApolloServer } from "@apollo/server";
import BookstoreAPI from "./dataSources/bookstoreAPI.js";
import typeDefs from "./schema.js";
import resolvers from "./resolvers.js";

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

await server.start();
app.use(
    '/',
    cors(),
  bodyParser.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => {
        const { cache } = server;
        return {
            token: req.headers.token,
            dataSources: {
                bookstoreAPI: new BookstoreAPI({ cache })
            },
            authScope: req.headers
        }

    }   
  })
)
app.post('/', (req, res) => {
    res.send("Hello World")
})
const port = process.env.PORT || 4000;
await new Promise((resolve) => httpServer.listen({ port: port }, resolve));
console.log(`🚀 Server ready at ${port}`);