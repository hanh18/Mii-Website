import jwt from 'jsonwebtoken';

import arrMessage from './message';

const verifyToken = (request) => {
  try {
    const token = request.req.headers.authorization;

    if (!token) {
      throw new Error('Authorization is require');
    }

    const id = jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
      if (error) {
        return arrMessage.MESSAGE_TOKEN_EXPIRED;
      }

      return decoded.id;
    });

    return id;
  } catch (error) {
    throw new Error(error);
  }
};

export default verifyToken;
