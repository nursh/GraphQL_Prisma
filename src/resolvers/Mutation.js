import uuidv4 from "uuid/v4";

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: args.data.email });
    if (emailTaken) throw new Error("Email taken");

    const user = await prisma.mutation.createUser({ data: args.data }, info);
    return user;
  },
  async updateUser(parent, args, { prisma }, info) {
    // You don't need the error checking, it's just to provide a better error message
    const opArgs = {
      where: {
        id: args.id
      },
      data: args.data
    };
    return prisma.mutation.updateUser(opArgs, info);
  },
  async deleteUser(parent, args, { prisma }, info) {
    const userExists = await prisma.exists.User({ id: args.id });
    if (!userExists) throw new Error("User not found");

    const opArgs = {};
    opArgs.where = {
      id: args.id
    };
    const user = await prisma.mutation.deleteUser(opArgs, info);
    return user;
  },
  async createPost(parent, args, { prisma }, info) {
    const userExists = await prisma.exists.User({ id: args.data.author });
    if (!userExists) throw new Error("user not found");

    const { title, body, published, author } = args.data;
    const opArgs = {
      data: {
        title,
        body,
        published,
        author: {
          connect: {
            id: author
          }
        }
      }
    };
    const post = await prisma.mutation.createPost(opArgs, info);
    return post;
  },
  updatePost(parent, args, { prisma }, info) {
    const opArgs = {
      where: {
        id: args.id
      },
      data: args.data
    };
    return prisma.mutation.updatePost(opArgs, info);
  },
  deletePost(parent, args, { prisma }, info) {
    const opArgs = {
      where: {
        id: args.id
      }
    };
    return prisma.mutation.deletePost(opArgs, info);
  },
  createComment(parent, args, { prisma }, info) {
    return prisma.mutation.createComment({
      data: {
        text: args.data.text,
        author: {
          connect: {
            id: args.data.author
          }
        },
        post: {
          connect: {
            id: args.data.post
          }
        }
      }
    }, info);
  },
  updateComment(parent, args, { db, pubsub }, info) {
    return prisma.mutation.updateComment({
      where: {
        id: args.id
      },
      data: args.data
    }, info);
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    return prisma.mutation.deleteComment({
      where: {
        id: args.id
      }
    }, info);
  }
};

export { Mutation as default };
