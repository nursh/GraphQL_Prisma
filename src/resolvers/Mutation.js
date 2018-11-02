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
  createComment(parent, args, { db, pubsub }, info) {
    const { post: postId, author: authorId } = args.data;
    const userExists = db.users.some(user => user.id === authorId);
    const postExists = db.posts.some(
      post => post.id === postId && post.published
    );

    if (!userExists) throw new Error("User not found");
    if (!postExists) throw new Error("Post not found");

    const comment = {
      id: uuidv4(),
      ...args.data
    };

    db.comments.push(comment);
    pubsub.publish(`comment ${postId}`, {
      comment: {
        mutation: "CREATED",
        data: comment
      }
    });
    return comment;
  },
  updateComment(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const { text } = data;

    const comment = db.comments.find(comment => comment.id === id);
    if (!comment) throw new Error("Comment not found");

    if (typeof text === "string") comment.text = text;

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: "UPDATED",
        data: comment
      }
    });
    return comment;
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    const { id } = args;
    const commentIndex = db.comments.findIndex(comment => comment.id === id);

    if (commentIndex === -1) throw new Error("Comment does not exist");

    const [deletedComment] = db.comments.splice(commentIndex, 1);

    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: "DELETED",
        data: deletedComment
      }
    });
    return deletedComment;
  }
};

export { Mutation as default };
