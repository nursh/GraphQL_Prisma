import "cross-fetch/polyfill";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";

import prisma from "../src/prisma";
import seedDatabase from './utils/seedDatabase';

const client = new ApolloClient({
  uri: "http://localhost:4000"
});

beforeEach(seedDatabase);

test("should return only published posts", async () => {
  const getPosts = gql`
    query {
      posts {
        id
        published
      }
    }
  `;

  const response = await client.query({ query: getPosts });
  const [pubPost] = response.data.posts;
  expect(response.data.posts.length).toBe(1);
  expect(pubPost.published).toBe(true);
});