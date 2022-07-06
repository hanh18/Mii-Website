import { PrismaClient } from '@prisma/client';

import arrResponse from '../utils/response';
import arrMessage from '../utils/message';

const prisma = new PrismaClient();

const getUserPage = async (req, res) => {
  const user = await prisma.user.findMany();

  arrResponse.success(res, user);
};

const getUserById = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  const user = await prisma.user.findFirst({ where: { id } });

  arrResponse.success(res, user);
};

// eslint-disable-next-line consistent-return
const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  const isActive = await prisma.user.findFirst({ where: { id, isActive: true } });

  if (isActive !== null) {
    return arrResponse.badRequest(res, arrMessage.MESSAGE_CANNOT_DELETE_USER);
  }

  // handle delete user in here
  arrResponse.success(res);
};

// eslint-disable-next-line consistent-return
const blockUser = async (req, res) => {
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
};

export default {
  getUserPage,
  getUserById,
  deleteUser,
  blockUser,
};
