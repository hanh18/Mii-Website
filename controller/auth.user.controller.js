import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

import arrMessage from '../utils/message';

const prisma = new PrismaClient();

const activeAccount = async (req, res) => {
  try {
    const { token } = req.params;

    // check exist token
    if (!token) {
      throw new Error(arrMessage.MESSAGE_REQUIRED_AUTHORIZATION);
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const id = await decoded.id;

    await prisma.user.update({
      where: { id },
      data: {
        isActive: true,
      },
    });

    // redirect: home page
    res.send('Account active');
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  activeAccount,
};
