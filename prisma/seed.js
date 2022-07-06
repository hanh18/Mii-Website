import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const seed = async () => {
  const password = '123123';
  // generate salt to hash password
  const salt = await bcrypt.genSalt(10);
  // hash password
  const hashedPassword = await bcrypt.hash(password, salt);

  const admin = {
    email: 'admin@gmail.com',
		password: hashedPassword,
    name: 'My Hanh',
  };

  await prisma.admin.create({
    data: admin,
  });
};

seed();
