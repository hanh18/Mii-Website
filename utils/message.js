const arrMessage = {
  // auth
  MESSAGE_TOKEN_EXPIRED: 'Token expired',
  MESSAGE_REQUIRED_AUTHORIZATION: 'Authorization is require',
  MESSAGE_ACTIVE_ACCOUNT: 'Please activate your account',
  MESSAGE_EMAIL_USERNAME_EXISTS: 'Email or username already exists',
  MESSAGE_EMAIL_NOT_FOUND: 'User does not exist',
  MESSAGE_INVALID: 'Invalid password reset request',
  MESSAGE_PLEASE_LOGIN: 'Please login',
  MESSAGE_EMAIL_EXISTS: 'Email already exists',
  MESSAGE_LOGIN_FAILED: 'Username and password are incorrect',

  // user
  MESSAGE_BIRTHDAY_INVALID: 'Birthday invalid',
  MESSAGE_DELETE_IMAGE_ERROR: 'Delete image error',
  MESSAGE_CANNOT_DELETE_USER: 'Can\'t delete user',
  MESSAGE_USER_NOT_FOUND: 'User does not exist',
  MESSAGE_ADMIN_NOT_FOUND: 'Admin does not exist',

  // category
  MESSAGE_CATEGORY_NOT_FOUND: 'Category does not exist',
  MESSAGE_REQUIRED_NAME_CATEGORY: 'Category name is require',
  MESSAGE_CANNNOT_DELETE_CATEGORY: 'There are products in this category',

  // product
  MESSAGE_PRODUCT_NOT_FOUND: 'Product does not exist',
  MESSAGE_IMAGE_NOT_FOUND: 'Image does not exist',
  MESSAGE_PRODUCT_CATEGORY_NOT_FOUND: 'Category or product do not exist',
  MESSAGE_PRODUCT_CATEGORY_ALREADY_EXISTS: 'Category already exists',
  MESSAGE_AMOUNT_INVALID: 'Amount invalid',
  MESSAGE_CANNOT_DELETE_PRODUCT: 'There are orders containing products',

  // order
  MESSAGE_STATUS_ORDER_INVALID: 'Status invalid',
  MESSAGE_ORDER_NOT_FOUND: 'Order does not exist',
  MESSAGE_PRODUCT_NOT_FOUND_IN_CART: 'Product not found in cart',
  MESSAGE_PAYMENT_METHOD_NOT_FOUND: 'Payment method does not exist',
  MESSAGE_NOT_ENOUGH_PRODUCT: 'Not enough products',
  MESSAGE_OUT_OF_STOCK: 'Out of stock',
  MESSAGE_ADD_PRODUCT_SUCCESS: 'Add product success',
  MESSAGE_CHECKOUT_SUCCESS: 'Checkout success',

  MESSAGE_ERROR_INTERNAL_SERVER: 'Internal Server Error',
  MESSAGE_INVALID_PHONE: 'Invalid phone',
  MESSAGE_REQUIRED_PASSWORD: 'Password is required',
  MESSAGE_PASSWORD_NOT_MATCH: 'New password and confirm password do not match',
  MESSAGE_CHANGE_PASSWORD_SUCCESS: 'Change password success',
  MESSAGE_INVALID_PASSWORD: 'Invalid password',
  MESSAGE_REQUIRED_IMAGE: 'Image is required',
  MESSAGE_ALL_INPUT_REQUIRED: 'All input is required',
  MESSAGE_NOT_FOUND: 'Not found',
  MESSAGE_INVALID_INFORMATION: 'Invalid infomation',
  MESSAGE_TIME_INVALID: 'Time invalid',
  MESSAGE_TIME_INVALID_BEFORE_30M: 'Time invalid. Minimum end time 30 minutes from start time !',

  MESSAGE_EMAIL_NOT_REGISTERED: 'The Email is not registered with us',
  MESSAGE_SENT_EMAIL: 'The verification link has been sent to your email address',
  MESSAGE_SOMETHING_WRONG: 'Something goes to wrong. Please try again',
  MESSAGE_EMAIL_VERIFIED: 'Email has been verified',
  MESSAGE_USER_EXIST: 'User Already Exist. Please Login',

  MESSAGE_STATUS_NOT_FOUND: 'Status not found',

  // return
  MESSAGE_UPDATE_SUCCESS: 'Update successs',
  MESSAGE_DELETE_SUCCESS: 'Delete success',
  MESSAGE_CREATE_SUCCESS: 'Create success',
};

export default arrMessage;
