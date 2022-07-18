import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

import verifyToken from '../utils/verifyToken';
import generateToken from '../utils/generateToken';
import arrMessage from '../utils/message';
import mailOption from '../utils/mailOption';
import handleSendEmail from '../utils/sendEmail';
import htmlActiveAccount from '../utils/htmlEmail/verifyAccount';
import htmlForgotPassword from '../utils/htmlEmail/forgotPassword';
import formattedDate from '../utils/formattedDate';

const prisma = new PrismaClient();

const prismaDataMethods = {
  // USER
  getProfileUser: async (args, request) => {
    try {
      const id = await verifyToken(request);

      if (id === arrMessage.MESSAGE_TOKEN_EXPIRED) {
        throw new Error(arrMessage.MESSAGE_PLEASE_LOGIN);
      }
      const user = await prisma.user.findFirst({ where: { id } });

      return user;
    } catch (error) {
      throw new Error(error);
    }
  },

  createUser: async (args) => {
    try {
      const { data } = args;

      if (!(data.email && data.password && data.username)) {
        throw new Error(arrMessage.MESSAGE_ALL_INPUT_REQUIRED);
      }

      // Check unique user
      const isUserNameOrEmailUnique = await prisma.user.findFirst({
        where: {
          OR: [
            {
              email: data.email,
            },
            {
              username: data.username,
            },
          ],
        },
      });

      if (isUserNameOrEmailUnique) {
        throw new Error(arrMessage.MESSAGE_EMAIL_USERNAME_EXISTS);
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);
      data.password = hashedPassword;

      // Create user
      const user = await prisma.user.create({
        data,
      });

      // Handle send email active account
      const userId = user.id;
      const titleEmail = 'Active account';
      const { email } = user;
      const token = await generateToken(userId, '1d');
      const html = htmlActiveAccount(email, token);

      handleSendEmail(mailOption(email, titleEmail, html));

      return {
        token,
      };
    } catch (error) {
      throw new Error(error);
    }
  },
  editUser: async (args, request) => {
    try {
      const id = await verifyToken(request);
      const { data } = args;

      // check valid token
      if (id === arrMessage.MESSAGE_TOKEN_EXPIRED) {
        throw new Error(arrMessage.MESSAGE_PLEASE_LOGIN);
      }

      // check unique email
      const user = await prisma.user.findFirst({ where: { id } });
      const { email } = user;

      if (data.email !== null && data.email !== email) {
        const isUniqueEmail = await prisma.user.findFirst({ where: { email: data.email } });

        if (isUniqueEmail) {
          throw new Error(arrMessage.MESSAGE_EMAIL_EXISTS);
        }
      }

      // check birthday valid
      let { birthday } = data;

      if (birthday !== null) {
        // check full date month year
        if (!(birthday.length >= 8 && birthday.length <= 10)) {
          throw new Error(arrMessage.MESSAGE_BIRTHDAY_INVALID);
        }

        // check data valid
        birthday = (new Date(birthday)).toString();
        if (birthday === 'Invalid Date') {
          throw new Error(arrMessage.MESSAGE_BIRTHDAY_INVALID);
        }

        birthday = formattedDate(new Date(birthday));
        data.birthday = birthday;
      }

      // update user
      const updateUser = await prisma.user.update({
        where: {
          id,
        },
        data,
      });

      return updateUser;
    } catch (error) {
      throw new Error(error);
    }
  },

  // AUTH
  login: async (args) => {
    try {
      const { username, password } = args.data;
      const user = await prisma.user.findFirst({ where: { username } });

      // check exist user
      if (!user) {
        throw new Error(arrMessage.MESSAGE_USER_NOT_FOUND);
      }

      // Check active account
      if (!user.isActive) {
        throw new Error(arrMessage.MESSAGE_ACTIVE_ACCOUNT);
      }

      // Check match password in database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error(arrMessage.MESSAGE_SOMETHING_WRONG);
      }

      const userId = user.id;

      return {
        user,
        token: generateToken(userId, '1d'),
      };
    } catch (error) {
      throw new Error(error);
    }
  },
  forgotPassword: async (args) => {
    try {
      const { email } = args.data;

      // check email exists
      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (!user) {
        throw new Error(arrMessage.MESSAGE_EMAIL_NOT_FOUND);
      }

      const userId = user.id;
      const token = generateToken(userId, '3m');
      const subject = 'Generate new password';
      const html = htmlForgotPassword(email, token);

      // save token in db
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          validToken: token,
        },
      });

      handleSendEmail(mailOption(email, subject, html));

      return {
        message: 'success',
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  // CATEGORY
  getCategories: async (args) => {
    try {
      const sortAttribute = {
        name: null,
        count: null,
      };

      // get and sort category
      let getcategories;
      if (args.sortName && args.sortProductQuantity) {
        sortAttribute.name = args.sortName;
        sortAttribute.count = args.sortProductQuantity;

        getcategories = await prisma.category.findMany({
          orderBy: [
            {
              name: sortAttribute.name,
            },
            {
              categoryProduct: {
                _count: sortAttribute.count,
              },
            },
          ],
        });
      } else if (args.sortName) {
        sortAttribute.name = args.sortName;

        getcategories = await prisma.category.findMany({
          orderBy: {
            name: sortAttribute.name,
          },
        });
      } else if (args.sortProductQuantity) {
        sortAttribute.count = args.sortProductQuantity;

        getcategories = await prisma.category.findMany({
          orderBy: {
            categoryProduct: {
              _count: sortAttribute.count,
            },
          },
        });
      }

      // filter attribute (get only name and thumbmail from categories)
      const categories = getcategories.map((category) => {
        const categoriesChild = {
          name: category.name,
          thumbnail: category.thumbnail,
        };

        return categoriesChild;
      });

      return categories;
    } catch (error) {
      throw new Error(error);
    }
  },

  getCategory: async (ID) => {
    try {
      const category = await prisma.category.findFirst({ where: { id: ID } });

      const countProduct = await prisma.categoryProduct.count({
        where: {
          categoryId: ID,
        },
      });

      category.productQuantity = countProduct;

      return category;
    } catch (error) {
      throw new Error(error);
    }
  },

  // Product
  getListProduct: async (args) => {
    try {
      const sortAttribute = {
        name: null,
        price: null,
      };

      // get and sort product
      let getProducts;
      if (args.sortName && args.sortPrice) {
        sortAttribute.name = args.sortName;
        sortAttribute.price = args.sortPrice;

        getProducts = await prisma.product.findMany({
          include: {
            productImg: {
              where: {
                isDefault: true,
              },
            },
          },
          orderBy: [
            {
              name: sortAttribute.name,
            },
            {
              price: sortAttribute.price,
            },
          ],
        });
      } else if (args.sortName) {
        sortAttribute.name = args.sortName;

        getProducts = await prisma.product.findMany({
          include: {
            productImg: {
              where: {
                isDefault: true,
              },
            },
          },
          orderBy: {
            name: sortAttribute.name,
          },
        });
      } else if (args.sortPrice) {
        sortAttribute.price = args.sortPrice;

        getProducts = await prisma.product.findMany({
          include: {
            productImg: {
              where: {
                isDefault: true,
              },
            },
          },
          orderBy: {
            price: sortAttribute.price,
          },
        });
      } else {
        getProducts = await prisma.product.findMany({
          include: {
            productImg: {
              where: {
                isDefault: true,
              },
            },
          },
        });
      }

      const products = getProducts.map((product) => {
        if (product.productImg.length > 0) {
          product.thumbnail = product.productImg[0].link;
        }

        return product;
      });

      return products;
    } catch (error) {
      throw new Error(error);
    }
  },

  getProductsFilterByCategory: async (categoryId) => {
    try {
      // get all product have categoryId
      const productsByCategory = await prisma.category.findFirst({
        where: {
          id: categoryId,
        },
        include: {
          categoryProduct: {
            include: {
              product: {
                include: {
                  productImg: {
                    where: {
                      isDefault: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // get thumbnail of product
      const products = productsByCategory.categoryProduct.map((item) => {
        if (item.product.productImg.length > 0) {
          item.product.thumbnail = item.product.productImg[0].link;
        }

        return item.product;
      });

      return products;
    } catch (error) {
      throw new Error(error);
    }
  },

  getProduct: async (ID) => {
    try {
      const product = await prisma.product.findFirst({
        where: {
          id: ID,
        },
        include: {
          productImg: true,
        },
      });

      return product;
    } catch (error) {
      throw new Error(error);
    }
  },
};

export default prismaDataMethods;
