import jwt from 'jsonwebtoken';

const generateToken = (id, expiresIn) => jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn });

export default generateToken;
