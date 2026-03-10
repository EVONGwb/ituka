import express from 'express';

const router = express.Router();

// Placeholder routes
router.get('/users', (req, res) => {
  res.json({ users: [] });
});

router.get('/users/:id', (req, res) => {
  res.json({ user: { id: req.params.id } });
});

export default router;
