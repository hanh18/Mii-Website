import { PrismaClient } from '@prisma/client';

import arrResponse from '../utils/response';
import arrMessage from '../utils/message';

const prisma = new PrismaClient();

const getUserPage = async (req, res) => {
  try {
    const user = await prisma.user.findMany();

    arrResponse.success(res, user);
  } catch (error) {
    throw new Error(error);
  }
};

const getUserById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const user = await prisma.user.findFirst({ where: { id } });

    arrResponse.success(res, user);
  } catch (error) {
    throw new Error(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const isActive = await prisma.user.findFirst({ where: { id, isActive: true } });

    if (isActive !== null) {
      return arrResponse.badRequest(res, arrMessage.MESSAGE_CANNOT_DELETE_USER);
    }

    // handle delete user in here
    arrResponse.success(res);
  } catch (error) {
    throw new Error(error);
  }
};

const blockUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const isUserAndActive = await prisma.user.findFirst({ where: { id, isActive: false } });

    if (isUserAndActive === null) {
      return arrResponse.badRequest(res, arrMessage.MESSAGE_NOT_FOUND);
    }

    const { isBlock } = isUserAndActive;

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        isBlock: !isBlock,
      },
    });

    arrResponse.success(res, user.isBlock);
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  getUserPage,
  getUserById,
  deleteUser,
  blockUser,
};
