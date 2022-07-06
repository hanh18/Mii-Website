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

    await prisma.$transaction([...run]);
  } catch (err) {
    // Handle the rollback...
    console.log(err);
  }
};

seed();
