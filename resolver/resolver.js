// parameter of resolve: parent, agrument, context
// return for schema

const resolves = {
  // QUERY
  Query: {
    user: (parent, args, { prismaDataMethods, request }) => prismaDataMethods.getProfileUser(args, request),
  },

  // User: {
  //   post: async ({ id }, args, { mongoDataMethod }) => mongoDataMethods.getPostInUser(id),
  //   profile: async ({ id }, args, { mongoDataMethod }) => mongoDataMethods.getProfileOfUser(id),
  // },

  // MUTATION
  Mutation: {
    // Login
    login: (parent, args, { prismaDataMethods }) => prismaDataMethods.login(args),
    // createUser: async (parent, args, { mongoDataMethod }) => mongoDataMethods.createUser(args),
  },
};

export default resolves;
