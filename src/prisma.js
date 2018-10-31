import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "./src/generated/prisma.graphql",
  endpoint: "http://localhost:4466"
});

// Prisma Query
const createPostforUser = async (authorId, data) => {
  const userExists = await prisma.exists.User({ id: authorId });

  if (!userExists) throw new Error("User not found");

  const post = await prisma.mutation.createPost(
    {
      data: {
        ...data,
        author: {
          connect: {
            id: authorId
          }
        }
      }
    },
    "{ author { id name email posts { id title published } } }"
  );

  return post.author;
};

const updatePostforUser = async (postId, data) => {
  const postExists = await prisma.exists.Post({ id: postId });

  if (!postExists) throw new Error("Post not found");

  const post = await prisma.mutation.updatePost(
    {
      data,
      where: { id: postId }
    },
    `{ author { id name email posts { id title published } } }`
  );

  return post.author;
};

updatePostforUser("cjnw4rrpx00340774jx0clpkx", {
  title: "From Paris with love",
  body: "Cracking the hands of kitchen staff"
})
  .then(data => {
    console.log(JSON.stringify(data, undefined, 2));
  })
  .catch(err => {
    console.log(err);
  });

// createPostforUser("cjnvndgh7001x0774lcw8rrie", {
//   title: "Castlevania",
//   body: "Alucard is fighting his father...",
//   published: true
// })
//   .then(user => {
//     console.log(JSON.stringify(user, undefined, 2));
//   })
//   .catch(err => {
//     console.log(err);
//   });
