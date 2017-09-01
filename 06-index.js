"use strict";

const express = require("express");
const graphqlHTTP = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean
} = require("graphql");

const PORT = process.env.port || 3000;
const server = express();

const videoType = new GraphQLObjectType({
  name: "VideoType",
  description: "A video on my domain",
  fields: {
    id: {
      type: GraphQLID,
      description: "The id for the video"
    },
    title: {
      type: GraphQLString,
      description: "The title of the video"
    },
    duration: {
      type: GraphQLInt,
      description: "The duration of the video (in seconds)"
    },
    watched: {
      type: GraphQLBoolean,
      description: "Whether or not the viewer has watched the video"
    }
  }
});

const queryType = new GraphQLObjectType({
  name: "QueryType",
  description: "The root query type",
  fields: {
    video: {
      type: videoType,
      resolve: () => new Promise(resolve => {
        resolve({
          id: "1",
          title: "First Video",
          duration: 180,
          watched: true
        });
      })
    }
  }
});

const schema = new GraphQLSchema({
  query: queryType
})


const videoA = {
  id: "1",
  title: "First Video",
  duration: 180,
  watched: true
};

const videoB = {
  id: "2",
  title: "Second Video",
  duration: 120,
  watched: true
};

const videos = [videoA, videoB];

server.use("/graphql", graphqlHTTP({
  schema,
  graphiql: true
}));

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

// In Graphiql
// {
//   video {
//     id
//   	title
//     duration
//     watched
// 	}
// }