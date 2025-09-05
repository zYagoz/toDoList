import express from 'express';
import { listController } from './controllers/listController.js';

const router = express.Router();


router.get('/', listController.index);
router.get('/lists/:id', listController.show)


export default router