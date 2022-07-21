import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const helper = {
  updateAmountInProduct: async (productId, remainingAmount) => {
    try {
      await prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          amount: remainingAmount,
        },
      });
    } catch (error) {
      return error;
    }
  },
};

export default helper;
