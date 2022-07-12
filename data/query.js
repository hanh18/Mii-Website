import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

import verifyToken from '../utils/verifyToken';
import generateToken from '../utils/generateToken';
import arrMessage from '../utils/message';

const prisma = new PrismaClient();

const prismaDataMethods = {
  // USER
  getProfileUser: async (args, request) => {
    try {
      const id = await verifyToken(request);

      const user = await prisma.user.findFirst({ where: { id } });

      return user;
    } catch (error) {
      throw new Error(error);
    }
  },

  login: async (args) => {
    try {
      const { username, password } = args.data;
      const user = await prisma.user.findFirst({ where: { username } });

      // check exist user
      if (!user) {
        throw new Error(arrMessage.MESSAGE_USER_NOT_FOUND);
      }

      // Check match password in database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error(arrMessage.MESSAGE_SOMETHING_WRONG);
      }

      const userId = user.id;

      return {
        user,
        token: generateToken(userId, '1d'),
      };
    } catch (error) {
      throw new Error(error);
    }
  },
};

export default prismaDataMethods;
