import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "./src/generated/prisma.graphql",
  endpoint: "http://localhost:4466"
});

// Prisma Query

// prisma.query.users(null, "{ id name posts { id title } }").then(data => {
//   console.log(JSON.stringify(data, undefined, 2));
// });

// prisma.query.comments(null, "{ id text author { id name }}").then(data => {
//   console.log(JSON.stringify(data, undefined, 2));
// })

// Prisma Mutation

// prisma.mutation
//   .createPost(
//     {
//       data: {
//         title: "Fighting about age difference...",
//         body: "...",
//         published: false,
//         author: {
//           connect: {
//             id: "cjnvnt72c002h07746ny7y4u1"
//           }
//         }
//       }
//     },
//     ` { id title body published }`
//   )
//   .then(data => {
//     console.log(data);
//     return prisma.query.users(null, "{ id name posts { id title } }");
//   })
//   .then(data => {
//     console.log(JSON.stringify(data, undefined, 2));
//   });

prisma.mutation
  .updatePost(
    {
      data: {
        body: 'Grandiose and fetching water...',
        published: true
      },
      where: {
        id: "cjnwbi9nl00400774b0qvyzv2"
      }
    },
    ` { id title body published }`
  )
  .then(data => {
    console.log(data);
    return prisma.query.posts(null, "{ id title published body }");
  })
  .then(data => {
    console.log(JSON.stringify(data, undefined, 2));
  });

