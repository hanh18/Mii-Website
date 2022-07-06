import express from 'express';

const router = express.Router();

router.get('/category', (req, res) => {
  res.send('This is manager category page');
});

export default router;
