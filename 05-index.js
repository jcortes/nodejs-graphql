"use strict";

const express = require("express");
const graphqlHTTP = require("express-graphql");
const { graphql, buildSchema } = require("graphql");

const PORT = process.env.port || 3000;
const server = express();

const schema = buildSchema(`
  type Video {
    id: ID,
    title: String,
    duration: Int,
    released: Boolean
  }

  type Query {
    video: Video,
    videos: [Video]
  }

  type Schema {
    query: Query
  }
`);

const videoA = {
  id: "1",
  title: "First Video",
  duration: 180,
  released: true
};

const videoB = {
  id: "2",
  title: "Second Video",
  duration: 120,
  released: true
};

const videos = [videoA, videoB];

const resolvers = {
  video: () => videoA,
  videos: () => videos
};

server.use("/graphql", graphqlHTTP({
  schema,
  graphiql: true,
  rootValue: resolvers
}));

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

// In Graphiql
// {
//   videos {
//   	title
// 	}
// }