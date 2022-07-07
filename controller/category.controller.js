import { PrismaClient } from '@prisma/client';

import arrResponse from '../utils/response';
import arrMessage from '../utils/message';

const prisma = new PrismaClient();

const getCategoryPage = async (req, res) => {
  const category = await prisma.category.findMany();

  arrResponse.success(res, category);
};

const getCategoryById = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  const category = await prisma.category.findFirst({ where: { id } });

  if (!category) {
    return arrResponse.notFound(res, arrMessage.MESSAGE_CATEGORY_NOT_FOUND);
  }

  arrResponse.success(res, category);
};

const createCategory = async (req, res) => {
  const category = req.body;

  if (!category.name) {
    return arrResponse.badRequest(res, arrMessage.MESSAGE_REQUIRED_NAME_CATEGORY);
  }

  if (!req.file) {
    console.log('no file');
    return arrResponse.badRequest(res, arrMessage.MESSAGE_REQUIRED_IMAGE);
  }

  category.thumbnail = req.file.path;

  const newCategory = await prisma.category.create({
    data: category,
  });

  arrResponse.success(res, { newCategory });
};

const editCategory = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, description } = req.body;

  // check category exists
  const isCategory = await prisma.category.findFirst({ where: { id } });
  let { thumbnail } = isCategory;

  if (isCategory === null) {
    return arrResponse.badRequest(res, arrMessage.MESSAGE_CATEGORY_NOT_FOUND);
  }

  if (req.file) {
    thumbnail = req.file.path;
  }

  const category = await prisma.category.update({
    where: {
      id,
    },
    data: {
      name,
      description,
      thumbnail,
    },
  });

  arrResponse.success(res, category);
};

const deleteCategory = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  // check category exists
  const isCategory = await prisma.category.findFirst({ where: { id } });

  if (isCategory === null) {
    return arrResponse.badRequest(res, arrMessage.MESSAGE_CATEGORY_NOT_FOUND);
  }

  // count products in this category
  const countProduct = await prisma.category.findFirst({
    where: {
      id,
    },
    include: {
      _count: {
        select: { categoryProduct: true },
      },
    },
  });

  // If the category has products, it cannot be deleted
  // eslint-disable-next-line no-underscore-dangle
  if (countProduct._count.categoryProduct !== 0) {
    console.log('Have product');
    return arrResponse.badRequest(res, arrMessage.MESSAGE_CANNNOT_DELETE_CATEGORY);
  }

  const handleDelete = await prisma.category.delete({ where: { id } });

  arrResponse.success(res, handleDelete);
};

export default {
  getCategoryPage,
  getCategoryById,
  createCategory,
  editCategory,
  deleteCategory,
};
