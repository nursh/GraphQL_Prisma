import bcrypt from "bcryptjs";
import prisma from "../../src/prisma";

const seedDatabase = async () => {
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();

  const user = await prisma.mutation.createUser({
    data: {
      name: "Jen",
      email: "jen@email.com",
      password: bcrypt.hashSync("hdjahsdfasdf")
    }
  });
  const postPublished = await prisma.mutation.createPost({
    data: {
      title: "Living la vida loca",
      body: "Shrek, Donkey and Puss in boots",
      published: true,
      author: {
        connect: {
          id: user.id
        }
      }
    }
  });
  const postDraft = await prisma.mutation.createPost({
    data: {
      title: "Madagascar",
      body: "Kowalski analysis",
      published: false,
      author: {
        connect: {
          id: user.id
        }
      }
    }
  });
}



export { seedDatabase as default };