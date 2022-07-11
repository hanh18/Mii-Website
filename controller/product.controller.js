import { PrismaClient } from '@prisma/client';

import arrResponse from '../utils/response';
import arrMessage from '../utils/message';

const prisma = new PrismaClient();

const getProductPage = async (req, res) => {
  try {
    const products = await prisma.product.findMany();

    arrResponse.success(res, products);
  } catch (error) {
    throw new Error(error);
  }
};

const getProductById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const product = await prisma.product.findFirst({ where: { id } });

    arrResponse.success(res, product);
  } catch (error) {
    throw new Error(error);
  }
};

const createProduct = async (req, res) => {
  try {
    // eslint-disable-next-line object-curly-newline
    const { name, price, amount, description } = req.body;

    // Check enough field
    if (!(name && price && amount)) {
      return arrResponse.badRequest(res, arrMessage.MESSAGE_ALL_INPUT_REQUIRED);
    }

    // Create
    const product = await prisma.product.create({
      data: {
        name,
        price: parseInt(price, 10),
        amount: parseInt(amount, 10),
        description,
      },
    });

    arrResponse.success(res, product);
  } catch (error) {
    throw new Error(error);
  }
};

// API upload image product
const uploadImage = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    // check product exist
    const product = await prisma.product.findFirst({ where: { id } });

    if (!product) {
      return arrResponse.badRequest(res, arrMessage.MESSAGE_PRODUCT_NOT_FOUND);
    }

    if (!req.files) {
      console.log('no file');
      return arrResponse.badRequest(res, arrMessage.MESSAGE_REQUIRED_IMAGE);
    }

    // add image into database
    const arrImage = req.files.image;

    arrImage.forEach(async (image) => {
      await prisma.productImage.create({
        data: {
          productId: parseInt(id, 10),
          link: image.path,
        },
      });
    });

    arrResponse.success(res);
  } catch (error) {
    throw new Error(error);
  }
};

// API select thumbnail
const thumbnail = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    // check exist image
    const image = await prisma.productImage.findFirst({ where: { id } });

    if (!image) {
      return arrResponse.badRequest(res, arrMessage.MESSAGE_IMAGE_NOT_FOUND);
    }

    // remove thumbnail before
    const { productId } = image;
    await prisma.productImage.updateMany({
      where: {
        productId,
      },
      data: {
        isDefault: false,
      },
    });

    // update thumbnail in database
    const updateThumbnail = await prisma.productImage.update({
      where: {
        id,
      },
      data: {
        isDefault: !image.isDefault,
      },
    });

    arrResponse.success(res, updateThumbnail);
  } catch (error) {
    throw new Error(error);
  }
};

// API add category into product
const addCategory = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    const categoryId = parseInt(req.params.categoryId, 10);

    // check exist product and category
    const isCategory = await prisma.category.findFirst({ where: { id: categoryId } });
    const isProduct = await prisma.product.findFirst({ where: { id: productId } });

    if (!(isCategory && isProduct)) {
      return arrResponse.badRequest(res, arrMessage.MESSAGE_PRODUCT_CATEGORY_NOT_FOUND);
    }

    // Check if the product has a category
    const isCategoryProduct = await prisma.categoryProduct.findFirst({ where: { categoryId } });

    if (!(isCategoryProduct === null)) {
      return arrResponse.badRequest(res, arrMessage.MESSAGE_PRODUCT_CATEGORY_ALREADY_EXISTS);
    }

    // add product category in database
    const productCategory = await prisma.categoryProduct.create({
      data: {
        productId,
        categoryId,
      },
    });

    arrResponse.success(res, productCategory);
  } catch (error) {
    throw new Error(error);
  }
};

const editProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    // eslint-disable-next-line object-curly-newline
    const { name, price, amount, description } = req.body;

    // check product exist
    const product = await prisma.product.findFirst({ where: { id } });

    if (!product) {
      return arrResponse.badRequest(res, arrMessage.MESSAGE_PRODUCT_NOT_FOUND);
    }

    // check amount
    if (amount < 0) {
      return arrResponse.badRequest(res, arrMessage.MESSAGE_AMOUNT_INVALID);
    }

    const updateProduct = await prisma.product.update({
      where: {
        id,
      },
      data: {
        name,
        price,
        amount: parseInt(amount, 10),
        description,
      },
    });

    arrResponse.success(res, updateProduct);
  } catch (error) {
    throw new Error(error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    // check product exist
    const product = await prisma.product.findFirst({ where: { id } });

    if (!product) {
      return arrResponse.badRequest(res, arrMessage.MESSAGE_PRODUCT_NOT_FOUND);
    }

    const productOrder = await prisma.product.findFirst({
      where: {
        id,
      },
      include: {
        orderProduct: true,
      },
    });

    const countOrder = productOrder.orderProduct.length;
    if (countOrder !== 0) {
      return arrResponse.badRequest(res, arrMessage.MESSAGE_CANNOT_DELETE_PRODUCT);
    }

    await prisma.$transaction([
      // handle delete image of product
      prisma.productImage.deleteMany({
        where: {
          productId: id,
        },
      }),

      // handle delete category of product
      prisma.categoryProduct.deleteMany({
        where: {
          productId: id,
        },
      }),

      // handle delete product
      prisma.product.delete({
        where: {
          id,
        },
      }),
    ]);

    arrResponse.success(res);
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  getProductPage,
  getProductById,
  createProduct,
  uploadImage,
  thumbnail,
  addCategory,
  editProduct,
  deleteProduct,
};
