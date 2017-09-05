"use strict";

const { graphql, buildSchema } = require("graphql");

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

const query = `
  query myFirstQuery {
    videos {
      id
      title
      duration
      released
    }
  }
`;

graphql(schema, query, resolvers)
  .then(result => console.log(result))
  .catch(error => console.log(error));
