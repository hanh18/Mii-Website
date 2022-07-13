import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import generateToken from '../utils/generateToken';
import arrMessage from '../utils/message';
import arrResponse from '../utils/response';

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

    // check active account
    const user = await prisma.user.findFirst({
      where: { id },
    });

    if (user.isActive) {
      arrResponse.badRequest(res, arrMessage.MESSAGE_EMAIL_VERIFIED);
    }

    await prisma.user.update({
      where: { id },
      data: {
        isActive: true,
      },
    });

    // redirect: home page
    arrResponse.success(res);
  } catch (error) {
    throw new Error(error);
  }
};

const getNewPassword = async (req, res) => {
  try {
    const { token } = req.params;
    let message;

    // check token in database
    const isToken = await prisma.user.findFirst({
      where: {
        validToken: token,
      },
    });

    if (!isToken) {
      return arrResponse.badRequest(res, arrMessage.MESSAGE_INVALID);
    }

    // decode token
    await jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        message = arrMessage.MESSAGE_TOKEN_EXPIRED;
        return;
      }

      const { id } = decoded;

      const newToken = generateToken(id, '30m');

      res.cookie('accessToken', newToken, { httpOnly: true, secure: true, maxAge: new Date(Date.now() + 1800000) });
    });

    // redirect to create new pass page
    arrResponse.success(res, 0, message);
  } catch (error) {
    throw new Error(error);
  }
};

const changePassword = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    // nhận password ở req.body
    // const { newPassword, confirmPassword } = req.body;
    const newPassword = '123123123';
    const confirmPassword = '123123123';

    // check match password & confirm password
    if (!(newPassword === confirmPassword)) {
      return arrResponse.badRequest(res, arrMessage.MESSAGE_PASSWORD_NOT_MATCH);
    }

    // get info user
    await jwt.verify(token, process.env.SECRET_KEY, async (error, decoded) => {
      if (error) {
        return arrResponse.badRequest(res, arrMessage.MESSAGE_TOKEN_EXPIRED);
      }

      const { id } = decoded;

      // hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await prisma.user.update({
        where: {
          id,
        },
        data: {
          password: hashedPassword,
        },
      });

      // redirect to login
      arrResponse.success(res);
    });
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  activeAccount,
  getNewPassword,
  changePassword,
};
