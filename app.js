import express from 'express';
import { json } from 'body-parser';

const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const app = express();

const PORT = 3000;

app.use(json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type  RootQuery {
            events: [String!]!
        }

        type RootMutation {
            createEvent(name:String): String
        }
        schema {
            query:RootQuery,
            mutation:RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return ["Late night cooking", "Watching movies", "All night sleeping"];
        },
        createEvent: (args) => {
            const eventName = args.name;
            return eventName;
        }
    },
    graphiql: true
}));

app.listen(PORT);