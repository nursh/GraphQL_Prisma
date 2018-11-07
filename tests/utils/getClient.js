import ApolloClient from "apollo-boost";

const getClient = () => {
  return new ApolloClient({
    uri: "http://localhost:4000"
  });  
}

export { getClient as default };