/* eslint-disable max-len */
// parameter of resolve: parent, agrument, context
// return for schema

const resolves = {
  // QUERY
  Query: {
    user: (parent, args, { prismaDataMethods, request }) => prismaDataMethods.getProfileUser(args, request),
    categories: (parent, args, { prismaDataMethods }) => prismaDataMethods.getCategories(args),
    category: (parent, { ID }, { prismaDataMethods }) => prismaDataMethods.getCategory(ID),
    products: (parent, args, { prismaDataMethods }) => prismaDataMethods.getListProduct(args),
    productsFilter: (parent, { categoryId }, { prismaDataMethods }) => prismaDataMethods.getProductsFilterByCategory(categoryId),
    product: (parent, { ID }, { prismaDataMethods }) => prismaDataMethods.getProduct(ID),
  },

  // User: {
  //   post: async ({ id }, args, { mongoDataMethod }) => mongoDataMethods.getPostInUser(id),
  //   profile: async ({ id }, args, { mongoDataMethod }) => mongoDataMethods.getProfileOfUser(id),
  // },

  // MUTATION
  Mutation: {
    // Login
    login: (parent, args, { prismaDataMethods }) => prismaDataMethods.login(args),
    createUser: (parent, args, { prismaDataMethods }) => prismaDataMethods.createUser(args),
    forgotPassword: (parent, args, { prismaDataMethods }) => prismaDataMethods.forgotPassword(args),
    editUser: (parent, args, { prismaDataMethods, request }) => prismaDataMethods.editUser(args, request),
  },
};

export default resolves;
