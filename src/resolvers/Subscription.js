const Subcription = {
  comment: {
    subscribe(parent, { postId }, { prisma }, info) {
      const opArgs = {
        where: {
          node: {
            post: {
              id: postId
            }
          }
        }
      };
      return prisma.subscription.comment(opArgs, info);
    }
  },
  post: {
    subscribe(parent, args, { prisma }, info) {
      const opArgs = {
        where: {
          node: {
            published: true
          }
        }
      };
      return prisma.subscription.post(opArgs, info);
    }
  }
};

export { Subcription as default };
