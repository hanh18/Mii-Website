import express from 'express';

const router = express.Router();

router.get('/user', (req, res) => {
  res.send('This is manager user');
});

export default router;
