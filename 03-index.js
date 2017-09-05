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
    video: Video
  }

  type Schema {
    query: Query
  }
`);

const resolvers = {
  video: () => ({
    id: "1",
    title: "First Video",
    duration: 180,
    released: true
  })
};

const query = `
  query myFirstQuery {
    video {
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
