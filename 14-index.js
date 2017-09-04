"use strict";

const express = require("express");
const graphqlHTTP = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLInterfaceType
} = require("graphql");
const {
  nodeDefinitions,
  fromGlobalId,
  globalIdField,
  connectionDefinitions,
  connectionArgs,
  connectionFromPromisedArray
} = require("graphql-relay");
const { getVideoById, getVideos, createVideo, getObjectById } = require("./data");

const PORT = process.env.port || 3000;
const server = express();


// This should be in another file
const { nodeInterface, nodeField } = nodeDefinitions(
  globalId => {
    const { type, id } = fromGlobalId(globalId);
    return getObjectById(type.toLowerCase(), id);
  },
  object => object.title && videoType
);
// end

const videoType = new GraphQLObjectType({
  name: "Video",
  description: "A video on my domain",
  fields: {
    id: globalIdField(),
    title: {
      type: GraphQLString,
      description: "The title of the video"
    },
    duration: {
      type: GraphQLInt,
      description: "The duration of the video (in seconds)"
    },
    released: {
      type: GraphQLBoolean,
      description: "Whether or not the video has been released"
    }
  },
  interfaces: [nodeInterface]
});

const { connectionType: VideoConnection } = connectionDefinitions({
  nodeType: videoType,
  connectionFields: () => ({
    totalCount: {
      type: GraphQLInt,
      description: "A count of the total number of objects in this connection",
      resolve: conn => conn.edges.length
    }
  })
});

const queryType = new GraphQLObjectType({
  name: "QueryType",
  description: "The root query type",
  fields: {
    node: nodeField,
    video: {
      type: videoType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: "The id of the video"
        }
      },
      resolve: (_, args) => getVideoById(args.id)
    },
    videos: {
      type: VideoConnection,
      args: connectionArgs,
      resolve: (_, args) => connectionFromPromisedArray(
        getVideos(),
        args
      )
    }
  }
});

const videoInputType = new GraphQLInputObjectType({
  name: "VideoInput",
  fields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The title of the video"
    },
    duration: {
      type: new GraphQLNonNull(GraphQLInt),
      description: "The duration of the video (in seconds)"
    },
    released: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: "Whether or not the video has been released"
    }
  }
})

const mutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "The root Mutation type",
  fields: {
    createVideo: {
      type: videoType,
      args: {
        video: {
          type: new GraphQLNonNull(videoInputType)
        }
      },
      resolve: (_, args) => {
        return createVideo(args.video);
      }
    }
  }
});

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});

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