export const notFound = (req, res, next) => {
  res.status(404).json({ error: { message: `Ruta no encontrada: ${req.originalUrl}` } });
};
