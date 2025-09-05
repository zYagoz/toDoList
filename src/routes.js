import express from 'express';
import { listController } from './controllers/listController.js';
import { taskController } from './controllers/tasksController.js';

const router = express.Router();

//Rotas da listas
router.get('/', listController.index);
router.post('/list/create', listController.save)
router.post('/list/delete/:id', listController.delete)
router.post('/list/update/:id', listController.update)

//Rotas das tasks   
router.get('/tasks', taskController.show)
router.get('/lists/:id', taskController.show)
router.post('/lists/:id/tasks', taskController.save)
router.post('/lists/:id/tasks/delete/:tasksId', taskController.delete)



export default router