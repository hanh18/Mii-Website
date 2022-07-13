import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

import verifyToken from '../utils/verifyToken';
import generateToken from '../utils/generateToken';
import arrMessage from '../utils/message';
import mailOption from '../utils/mailOption';
import handleSendEmail from '../utils/sendEmail';
import htmlActiveAccount from '../utils/htmlEmail/verifyAccount';

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

  createUser: async (args) => {
    try {
      const { data } = args;

      if (!(data.email && data.password && data.username)) {
        throw new Error(arrMessage.MESSAGE_ALL_INPUT_REQUIRED);
      }

      // Check unique user
      const isUserNameOrEmailUnique = await prisma.user.findFirst({
        where: {
          OR: [
            {
              email: data.email,
            },
            {
              username: data.username,
            },
          ],
        },
      });

      if (isUserNameOrEmailUnique) {
        throw new Error(arrMessage.MESSAGE_EMAIL_USERNAME_EXISTS);
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);
      data.password = hashedPassword;

      // Create user
      const user = await prisma.user.create({
        data,
      });

      // Handle send email active account
      const userId = user.id;
      const titleEmail = 'Active account';
      const { email } = user;
      const token = await generateToken(userId, '1d');
      const html = htmlActiveAccount(email, token);

      handleSendEmail(mailOption(email, titleEmail, html));

      return {
        token,
      };
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

      // Check active account
      if (!user.isActive) {
        throw new Error(arrMessage.MESSAGE_ACTIVE_ACCOUNT);
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
