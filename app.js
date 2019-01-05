const express = require('express');
const bodyParser = require('body-parser');

// mJy8ceOYkVf2avCA
const mongoose = require("mongoose");
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const Event = require('./models/event');

const app = express();

const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type  RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }
        schema {
            query:RootQuery,
            mutation:RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event.find({})
                .then(events => {
                    return events.map(event => {
                        return { ...event._doc };
                    })
                }).catch(err => console.log(err));
        },
        createEvent: args => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: args.eventInput.price,
                date: new Date(args.eventInput.date)
            });
            return event.save()
                .then(res => res)
                .catch((err) => console.log(err));
        }
    },
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-hiv7m.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`, { useNewUrlParser: true })
    .then(() => { app.listen(PORT); })
    .catch((err) => console.log(err));