import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

import arrResponse from '../utils/response';
import arrMessage from '../utils/message';

const prisma = new PrismaClient();

// const isAuthAdmin = (req, res, next) => {
//   if (req.session.isAuthAdmin) {
//     next();
//   } else {
//     res.send('login');
//   }
// };

const getLoginAdminPage = async (req, res) => {
  try {
    arrResponse.success(res);
  } catch (error) {
    throw new Error(error);
  }
};

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check enough field
    if (!(email, password)) {
      return arrResponse.badRequest(res, arrMessage.MESSAGE_ALL_INPUT_REQUIRED);
    }

    // Check account admin
    const admin = await prisma.admin.findFirst({
      where: {
        email,
      },
    });

    if (!admin) {
      return arrResponse.badRequest(res, arrMessage.MESSAGE_ADMIN_NOT_FOUND);
    }

    // Check password
    const validPassword = await bcrypt.compare(password, admin.password);

    if (!validPassword) {
      return arrResponse.badRequest(res, arrMessage.MESSAGE_INVALID_PASSWORD);
    }

    req.session.isAuthAdmin = true;
    res.send('Login successfully');
  } catch (error) {
    throw new Error(error);
  }
};

const logout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect('/');
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  getLoginAdminPage,
  handleLogin,
  logout,
};
