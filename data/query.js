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
import { statusOrder, paymentMethods } from '../utils/statusOrder';
import helper from '../utils/helper';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

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
        throw new Error(arrMessage.MESSAGE_LOGIN_FAILED);
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

  addToCart: async (args, request) => {
    try {
      // variable quantity
      let quantity = 1;
      const message = arrMessage.MESSAGE_ADD_PRODUCT_SUCCESS;

      // get id product
      const productId = parseInt(args.data.productId, 10);

      // get id user
      const userId = await verifyToken(request);

      // check token exprired
      if (userId === arrMessage.MESSAGE_TOKEN_EXPIRED) {
        throw new Error(arrMessage.MESSAGE_PLEASE_LOGIN);
      }

      // check exist product
      const isProduct = await prisma.product.findFirst({
        where: {
          id: productId,
        },
      });

      if (!isProduct) {
        throw new Error(arrMessage.MESSAGE_PRODUCT_NOT_FOUND);
      }

      // get cart of user
      const cart = await prisma.cart.findFirst({
        where: {
          userId,
        },
      });

      // get cart id
      const cartId = cart.id;

      // check product in cart
      const isProductInCart = await prisma.cartProduct.findFirst({
        where: {
          cartId,
          productId,
        },
      });

      // check amount product in stocks
      const { amount } = isProduct;

      if (amount === 0) {
        return { message: arrMessage.MESSAGE_OUT_OF_STOCK };
      }

      if (isProductInCart) {
        // check quantity product in cart <= amount product in stocks
        quantity = isProductInCart.quantity + 1;

        if (amount - quantity < 0) {
          return { message: arrMessage.MESSAGE_NOT_ENOUGH_PRODUCT };
        }

        // update quantity product in cart
        await prisma.cartProduct.updateMany({
          where: {
            cartId,
            productId,
          },
          data: {
            quantity,
          },
        });

        return { message };
      }

      // add product into cart on database
      await prisma.cartProduct.create({
        data: {
          quantity,
          productId,
          cartId,
        },
      });

      return { message };
    } catch (error) {
      throw new Error(error);
    }
  },

  // CART
  getCart: async (request) => {
    try {
      // get id user
      const userId = await verifyToken(request);

      // check token exprired
      if (userId === arrMessage.MESSAGE_TOKEN_EXPIRED) {
        throw new Error(arrMessage.MESSAGE_PLEASE_LOGIN);
      }

      // find cart of user
      const cart = await prisma.cart.findFirst({
        where: {
          userId,
        },
        include: {
          cartProduct: true,
        },
      });

      return cart;
    } catch (error) {
      throw new Error(error);
    }
  },

  getItemsInCart: async (request) => {
    try {
      // get id user
      const userId = await verifyToken(request);

      // check token exprired
      if (userId === arrMessage.MESSAGE_TOKEN_EXPIRED) {
        throw new Error(arrMessage.MESSAGE_PLEASE_LOGIN);
      }

      // find cart of user
      const cart = await prisma.cart.findFirst({
        where: {
          userId,
        },
        include: {
          cartProduct: {
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

      // filter attribute of product
      const productInCart = cart.cartProduct.map((item) => {
        const product = {
          name: item.product.name,
          price: item.product.price,
          thumbnail: item.product.productImg[0].link,
          quantity: item.quantity,
        };

        return product;
      });

      return productInCart;
    } catch (error) {
      throw new Error(error);
    }
  },

  removeProductInCart: async (agrs, request) => {
    try {
      const message = arrMessage.MESSAGE_DELETE_SUCCESS;
      const productId = parseInt(agrs.data.productId, 10);
      // get id user
      const userId = await verifyToken(request);

      // check token exprired
      if (userId === arrMessage.MESSAGE_TOKEN_EXPIRED) {
        throw new Error(arrMessage.MESSAGE_PLEASE_LOGIN);
      }

      // check exist product
      const isProduct = await prisma.product.findFirst({
        where: {
          id: productId,
        },
      });

      // get cart of user
      const cart = await prisma.cart.findFirst({
        where: {
          userId,
        },
      });

      // get cart id
      const cartId = cart.id;

      // check product in cart
      const isProductInCart = await prisma.cartProduct.findFirst({
        where: {
          cartId,
          productId,
        },
      });

      if (!(isProduct && isProductInCart)) {
        throw new Error(arrMessage.MESSAGE_PRODUCT_NOT_FOUND);
      }

      // get id product in cart
      const cartProductId = isProductInCart.id;

      // delete cart product by id
      await prisma.cartProduct.delete({
        where: {
          id: cartProductId,
        },
      });

      return { message };
    } catch (error) {
      throw new Error(error);
    }
  },

  increaseQuantityProductInCart: async (agrs, request) => {
    try {
      const message = arrMessage.MESSAGE_UPDATE_SUCCESS;
      const productId = parseInt(agrs.data.productId, 10);
      // get id user
      const userId = await verifyToken(request);

      // check token exprired
      if (userId === arrMessage.MESSAGE_TOKEN_EXPIRED) {
        throw new Error(arrMessage.MESSAGE_PLEASE_LOGIN);
      }

      // check exist product and check product in cart
      const isProduct = await prisma.product.findFirst({
        where: {
          id: productId,
        },
      });

      // get cart of user
      const cart = await prisma.cart.findFirst({
        where: {
          userId,
        },
      });

      // get cart id
      const cartId = cart.id;

      const isProductInCart = await prisma.cartProduct.findFirst({
        where: {
          cartId,
          productId,
        },
      });

      if (!(isProduct && isProductInCart)) {
        throw new Error(arrMessage.MESSAGE_PRODUCT_NOT_FOUND);
      }

      // get id product in cart
      const cartProductId = isProductInCart.id;
      let { quantity } = isProductInCart;
      quantity += 1;
      const { amount } = isProduct;

      // check quantity in cart <= amount products in stocks
      if (amount - quantity < 0) {
        return { message: arrMessage.MESSAGE_NOT_ENOUGH_PRODUCT };
      }

      // increase quantity product
      await prisma.cartProduct.update({
        where: {
          id: cartProductId,
        },
        data: {
          quantity,
        },
      });

      return { message };
    } catch (error) {
      throw new Error(error);
    }
  },

  reduceQuantityProductInCart: async (agrs, request) => {
    try {
      const message = arrMessage.MESSAGE_UPDATE_SUCCESS;
      const productId = parseInt(agrs.data.productId, 10);
      // get id user
      const userId = await verifyToken(request);

      // check token exprired
      if (userId === arrMessage.MESSAGE_TOKEN_EXPIRED) {
        throw new Error(arrMessage.MESSAGE_PLEASE_LOGIN);
      }

      // check exist product and check product in cart
      const isProduct = await prisma.product.findFirst({
        where: {
          id: productId,
        },
      });

      // get cart of user
      const cart = await prisma.cart.findFirst({
        where: {
          userId,
        },
      });

      // get cart id
      const cartId = cart.id;

      const isProductInCart = await prisma.cartProduct.findFirst({
        where: {
          cartId,
          productId,
        },
      });

      if (!(isProduct && isProductInCart)) {
        throw new Error(arrMessage.MESSAGE_PRODUCT_NOT_FOUND);
      }

      // get id product in cart
      const cartProductId = isProductInCart.id;
      let { quantity } = isProductInCart;

      // check quantity of product (if quantity != 1 -> update)
      if (quantity === 1) {
        return { message };
      }
      quantity -= 1;

      // increase quantity product
      await prisma.cartProduct.update({
        where: {
          id: cartProductId,
        },
        data: {
          quantity,
        },
      });

      return { message };
    } catch (error) {
      throw new Error(error);
    }
  },

  checkoutProduct: async (agrs, request) => {
    try {
      const message = arrMessage.MESSAGE_CHECKOUT_SUCCESS;
      const listProductId = agrs.data;
      const { paymentMethod } = agrs;
      let paymentDate = null;
      let status = statusOrder.pending;

      // get id user
      const userId = await verifyToken(request);

      // check token exprired
      if (userId === arrMessage.MESSAGE_TOKEN_EXPIRED) {
        throw new Error(arrMessage.MESSAGE_PLEASE_LOGIN);
      }

      // conver product id from string to int
      const listId = listProductId.map((item) => ({ id: parseInt(item.productId, 10) }));

      // check exist products in database
      const isProducts = await prisma.product.findMany({
        where: {
          OR: listId,
        },
      });

      if (listProductId.length !== isProducts.length) {
        return { message: arrMessage.MESSAGE_PRODUCT_NOT_FOUND };
      }

      // check exist products in cart
      // get cart of user
      const cart = await prisma.cart.findFirst({
        where: {
          userId,
        },
      });

      // get cart id
      const cartId = cart.id;

      // get list product id
      const listProductIdInCart = listProductId.map((item) => ({
        productId: parseInt(item.productId, 10), cartId,
      }));

      // get product in cart
      const productsInCart = await prisma.cartProduct.findMany({
        where: {
          OR: listProductIdInCart,
        },
      });
      // sort product in cart
      productsInCart.sort((a, b) => a.productId - b.productId);

      // check lại
      if (listProductId.length !== productsInCart.length) {
        return { message: arrMessage.MESSAGE_PRODUCT_NOT_FOUND_IN_CART };
      }

      // check quantity of products in cart <= amount of product in stock
      // eslint-disable-next-line max-len
      const isEnoughProductsInStocks = isProducts.filter((item, index) => item.amount >= productsInCart[index].quantity);

      if (isEnoughProductsInStocks.length !== productsInCart.length) {
        return { message: arrMessage.MESSAGE_NOT_ENOUGH_PRODUCT };
      }

      // check method payment
      if (!(paymentMethod in paymentMethods)) {
        return { message: arrMessage.MESSAGE_PAYMENT_METHOD_NOT_FOUND };
      }

      // if method payment = visa -> payment date = now
      if (paymentMethod === paymentMethods.visa) {
        paymentDate = new Date(Date.now());
        status = statusOrder.completed;
      }

      const result = await prisma.$transaction(async (Model) => {
        // create order
        const createOrder = await Model.order.create({
          data: {
            userId,
            status,
            paymentMethod,
            paymentDate,
          },
        });

        // create order product
        // convert data to order product
        // sort product
        productsInCart.sort((a, b) => a.productId - b.productId);

        const dataOrderProduct = productsInCart.map((item, index) => {
          const order = {
            productId: item.productId,
            quantity: item.quantity,
            price: isProducts[index].price,
            orderId: createOrder.id,
          };

          return order;
        });

        const createOrderProduct = await Model.orderProduct.createMany({
          data: dataOrderProduct,
        });

        // reduce amount in table product
        for (let i = 0; i < isProducts.length; i += 1) {
          const { amount } = isProducts[i];
          const { quantity } = productsInCart[i];
          const remainingAmount = amount - quantity;
          const productId = isProducts[i].id;

          helper.updateAmountInProduct(productId, remainingAmount);
        }

        const deleteCartProduct = await Model.cartProduct.deleteMany({
          where: {
            OR: listProductIdInCart,
          },
        });

        return { createOrder, createOrderProduct, deleteCartProduct };
      });

      console.log(result);

      return { message };
    } catch (error) {
      throw new Error(error);
    }
  },
};

export default prismaDataMethods;
