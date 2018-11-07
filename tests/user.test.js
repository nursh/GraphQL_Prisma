import "cross-fetch/polyfill";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";

import prisma from "../src/prisma";
import seedDatabase from './utils/seedDatabase';

const client = new ApolloClient({
  uri: "http://localhost:4000"
});

beforeEach(seedDatabase);

test("Should create a new user", async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: { name: "Nura", email: "nura@email.com", password: "Nuradeens" }
      ) {
        token
        user {
          id
        }
      }
    }
  `;

  const response = await client.mutate({
    mutation: createUser
  });

  const { id } = response.data;
  const userExists = await prisma.exists.User({ id });
  expect(userExists).toBe(true);
});

test("Should expose public author profiles", async () => {
  const getUsers = gql`
    query {
      users {
        id
        name
        email
      }
    }
  `;

  const response = await client.query({
    query: getUsers
  });

  const [jenUser] = response.data.users;

  expect(response.data.users.length).toBe(1);
  expect(jenUser.email).toBe(null);
  expect(jenUser.name).toBe("Jen");
});



test("Should not login with bad credentials", async () => {
  const login = gql`
    mutation {
      login(data: { email: "django@email.com", password: "jdshfkjdhss" }) {
        token
      }
    }
  `;

  await expect(client.mutate({ mutation: login })).rejects.toThrow();
});

test("Should not be able to create user with short password", async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: { name: "Dini", email: "dini@email.com", password: "dini" }
      ) {
        token
        user {
          id
        }
      }
    }
  `;

  await expect(
    client.mutate({
      mutation: createUser
    })
  ).rejects.toThrow();
});
