import { tasksModel } from "../models/taskModel.js"

export const taskController = {
    //GET /list/:id
    show: (req,res) =>{
            const id = req.params.id;
            const list = tasksModel.getAllTask(id)
            res.render(`list`, {list})
        }

    //Get /task/create

    //POST /task/create

    //POST /task/edit/:id

    //POST /task/update/:id

    //POST /task/delete/:id
}