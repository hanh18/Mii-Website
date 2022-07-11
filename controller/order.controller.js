import { PrismaClient } from '@prisma/client';

import arrResponse from '../utils/response';
import arrMessage from '../utils/message';
import orderStatus from '../utils/orderStatus';
import paymentMethod from '../utils/paymentMethod';

const prisma = new PrismaClient();

const getOrderPage = async (req, res) => {
  try {
    const orders = await prisma.order.findMany();

    arrResponse.success(res, orders);
  } catch (error) {
    // console.log(error);
    throw new Error(error);
  }
};

const getOrderById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const order = await prisma.order.findFirst({
      where: {
        id,
      },
    });

    arrResponse.success(res, order);
  } catch (error) {
    throw new Error(error);
  }
};

const changeStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const order = await prisma.order.findFirst({
      where: { id },
    });

    // Check valid order
    if (!order) {
      return arrResponse.badRequest(res, arrMessage.MESSAGE_ORDER_NOT_FOUND);
    }

    const { status } = order;
    const payment = order.paymentMethod;

    // status = completed
    if (status === orderStatus.completed) {
      const updateOrder = await prisma.order.update({
        where: {
          id,
        },
        data: {
          status: orderStatus.pending,
          paymentDate: null,
        },
      });

      return arrResponse.success(res, updateOrder);
    }

    // status = pending
    const data = {
      status: orderStatus.completed,
    };

    // if method = cash --> set payment date = date.now()
    if (payment === paymentMethod.cash) {
      data.paymentDate = new Date(Date.now());
    }

    const updateOrder = await prisma.order.update({
      where: {
        id,
      },
      data,
    });

    arrResponse.success(res, updateOrder);
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  getOrderPage,
  getOrderById,
  changeStatus,
};
