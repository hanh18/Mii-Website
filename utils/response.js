// eslint-disable-next-line import/no-import-module-exports
import arrMessage from './message';

const badRequest = (res, message) => {
  res.status(400).json({ message });
};

const serverError = (res) => {
  res.status(500).json({ message: arrMessage.MESSAGE_ERROR_INTERNAL_SERVER });
};

const error = (res, message) => {
  res.status(400).json({ message });
};

// eslint-disable-next-line default-param-last
const success = (res, data, message = 'Success') => {
  res.status(200).json({ message, data });
};

const notFound = (res, message = arrMessage.MESSAGE_NOT_FOUND) => {
  res.status(404).json({ message });
};

export default {
  badRequest,
  serverError,
  error,
  success,
  notFound,
};
