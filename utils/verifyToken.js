import jwt from 'jsonwebtoken';

const verifyToken = (request) => {
  try {
    const header = request.req.headers.authorization;

    if (!header) {
      throw new Error('Authorization is require');
    }

    const decoded = jwt.verify(header, process.env.SECRET_KEY);

    return decoded.id;
  } catch (error) {
    throw new Error(error);
  }
};

export default verifyToken;
