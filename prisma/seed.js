import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const seed = async () => {
  try {
    // Code running in a transaction...
    const password = '123123';
    // generate salt to hash password
    const salt = await bcrypt.genSalt(10);
    // hash password
    const hashedPassword = await bcrypt.hash(password, salt);

    // create array excute
    const run = [];

    // ADMIN
    const admin = {
      email: 'admin@gmail.com',
      password: hashedPassword,
      name: 'My Hanh',
    };

    const createAdmin = prisma.admin.create({
      data: admin,
    });
    run.push(createAdmin);

    // USER
    const user = {
      username: 'test',
      password: hashedPassword,
      email: 'test@gmail.com',
      fullName: 'test name',
      gender: 'female',
      birthday: '2000-10-20',
      address: '12 test Street, Da Nang',
      phone: '0958623154',
    };

    const createUser = prisma.user.create({
      data: user,
    });
    run.push(createUser);

    // CATEGORY
    const category = {
      name: 'shirt',
    };

    const createCategory = prisma.category.create({
      data: category,
    });
    run.push(createCategory);

    // PRODUCT
    const product = {
      name: 'Áo thun unisex CAPMAN basic TEE',
      price: 149000,
      amount: 50,
    };

    const createProduct = prisma.product.create({
      data: product,
    });

    run.push(createProduct);

    // PRODUCT CATEGORY
    const categoryProduct = {
      productId: 1,
      categoryId: 1,
    };

    const createCategoryProduct = prisma.categoryProduct.create({
      data: categoryProduct,
    });

    run.push(createCategoryProduct);

    // Order
    const order = {
      userId: 1,
      paymentMethod: 'cash',
      paymentDate: new Date(Date.now()),
      status: 'pending',
    };

    const createOrder = prisma.order.create({
      data: order,
    });
    run.push(createOrder);

    // ORDER PRODUCT
    const orderProduct = {
      orderId: 1,
      productId: 1,
      quantity: 2,
      price: 149000,
    };

    const createOrderProduct = prisma.orderProduct.create({
      data: orderProduct,
    });
    run.push(createOrderProduct);

    await prisma.$transaction([...run]);
  } catch (err) {
    // Handle the rollback...
    throw new Error(err);
  }
};

seed();
