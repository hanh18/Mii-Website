import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// const getUserId = require('../utils/getUserId');
// const generateToken = require('../utils/generateToken');

const mongoDataMethods = {
  // USER
  getAllUser: () => prisma.user.findMany(),
  getUserById: async (id) => prisma.user.findUnique({ where: { id: parseInt(id, 10) } }),
  // login: async (args) => {
  //   const user = await prisma.user.findFirst({ where: { email: args.data.email } });

  //   if (!user) {
  //     throw new Error('Unable to login');
  //   }

  //   // Check match password and email in here
  //   // let isMatch

  //   return {
  //     user,
  //     token: generateToken(user.id),
  //   };
  // },
};

export default mongoDataMethods;
