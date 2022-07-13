import jwt from 'jsonwebtoken';
import arrMessage from './message';

const verifyToken = (request) => {
  try {
    const token = request.req.headers.authorization;

    if (!token) {
      throw new Error('Authorization is require');
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY, async (error) => {
      if (error) {
        throw new Error(arrMessage.MESSAGE_TOKEN_EXPIRED);
      }
    });

    return decoded.id;
  } catch (error) {
    throw new Error(error);
  }
};

export default verifyToken;
