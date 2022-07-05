// parameter of resolve: parent, agrument, context
// return for schema

const resolves = {
  // QUERY
  Query: {
    users: async (parent, args, context) => context.mongoDataMethods.getAllUser(),
  },

  // User: {
  //   post: async ({ id }, args, { mongoDataMethod }) => mongoDataMethods.getPostInUser(id),
  //   profile: async ({ id }, args, { mongoDataMethod }) => mongoDataMethods.getProfileOfUser(id),
  // },

  // MUTATION
  Mutation: {
    // createUser: async (parent, args, { mongoDataMethod }) => mongoDataMethods.createUser(args),
  },
};

export default resolves;
