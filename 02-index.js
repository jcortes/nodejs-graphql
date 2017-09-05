"use strict";

const { graphql, buildSchema } = require("graphql");

const schema = buildSchema(`
  type Query {
    id: ID,
    title: String,
    duration: Int,
    released: Boolean
  }

  type Schema {
    query: Query
  }
`);

const resolvers = {
  id: () => "1",
  title: () => "bar",
  duration: () => 180,
  released: () => true,
};

const query = `
  query myFirstQuery {
    id
    title
    duration
    released
  }
`;

graphql(schema, query, resolvers)
  .then(result => console.log(result))
  .catch(error => console.log(error));
