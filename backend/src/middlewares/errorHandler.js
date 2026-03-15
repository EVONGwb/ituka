import { logger } from '../config/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);
  const status =
    err.status ||
    err.http_code ||
    (err.name === 'MulterError' ? 400 : 500);
  res.status(status).json({
    error: {
      message: err.message || 'Error interno del servidor',
    },
  });
};
