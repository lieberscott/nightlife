import express from 'express';

const router = express.Router();

router.get('/bars', (req, res) => {
  res.send({ data: "Hello" });
})

export default router;
