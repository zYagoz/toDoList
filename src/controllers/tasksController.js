import { tasksModel } from "../models/taskModel.js";
import { listModel } from "../models/listModel.js";

export const taskController = {
    //GET /list/:id
    show: (req,res) =>{
        try {
            const id = req.params.id;
            const tasklist = tasksModel.getAllTask(id);
            const list = listModel.getListById(id);
            if(!list) {
                console.error(`Lista não existente, voltando para home: ${error}`)
                return res.redirect('/')
            }
            res.render(`list`, {tasklist, list})
        } catch (error) {
            console.error(`erro ao tentar acessar: ${error}`)
            res.redirect('/')
        }
        },

    //Get /lists/:id/tasks
     save: (req, res) => {
            const id = req.params.id;
            const {taskName, taskDescription, priority, dueDate} = req.body;
            const newList = tasksModel.createTask(id,taskName, priority, dueDate, taskDescription)
            tasksModel.saveTask(newList, id);
            res.redirect(`/lists/${id}`)
        },

    //POST /lists/:id/tasks

    //POST /lists/edit/:id

    //POST /lists/update/:id

    //POST /lists/:id/tasks/delete
    delete: (req, res) =>{
        const id = req.params.id
        const taksId = req.params.tasksId;
        console.log(id,taksId)
        tasksModel.delete(id, taksId)
        res.redirect(`/lists/${id}`)
    }
}