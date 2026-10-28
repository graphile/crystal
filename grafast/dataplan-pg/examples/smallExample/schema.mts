/* eslint-disable graphile-export/export-methods, graphile-export/export-plans, graphile-export/export-instances, graphile-export/export-subclasses */
import { pgResources } from "./registry.mts";
import { typedMakeGrafastSchema } from "./schema-generated.mts";

const { users, posts } = pgResources;

export const schema = typedMakeGrafastSchema({
  typeDefs: /* GraphQL */ `
    scalar Datetime
    type Query {
      users: [User]
      posts: [Post]
    }
    type User {
      id: Int!
      username: String!
      createdAt: Datetime!
      posts: [Post]
    }
    type Post {
      id: Int!
      author: User
      body: String!
      createdAt: Datetime!
    }
  `,
  objects: {
    Query: {
      plans: {
        users() {
          return users.find();
        },
        posts() {
          return posts.find();
        },
      },
    },
    User: {
      plans: {
        createdAt($user) {
          return $user.get("created_at");
        },
        posts($user) {
          const $userId = $user.get("id");
          return posts.find({ author_id: $userId });
        },
      },
    },
    Post: {
      plans: {
        createdAt($post) {
          return $post.get("created_at");
        },
        author($post) {
          const $authorId = $post.get("author_id");
          return users.get({ id: $authorId });
        },
      },
    },
  },
});
