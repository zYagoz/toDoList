import { v4 as uuidv4 } from 'uuid';
import { compareAsc, format } from "date-fns";
import { listModel, listCreated } from "../models/listModel.js";

class taskUserCreate {
    constructor(name, priority, dueDate, description) {
        this.id = uuidv4();
        this.name = name;
        this.dueDate = dueDate;
        this.priority = priority
        this.description = description;
        this.status = 'incompleted';
        this.createdAt = new Date();
        this.updateAt = new Date();
    }
}

export let listTaskCreated = {};

export const tasksModel = {

    getAllTask(id) {
        const listInput = listModel.getListById(id)
        if (!listInput) return [];
        return listInput.tasks
    },

    createTask(id, name, priority, dueDate, taskDescription = '') {
        const listInput = listModel.getListById(id)
        if (!listInput) return null;
        if(!dueDate || dueDate === '') dueDate = format(new Date(), 'yyyy-MM-dd');
        const newTask = new taskUserCreate(name, priority, dueDate, taskDescription)
        console.log(`aqui a due data: ${dueDate}`)
        console.log(newTask)
        return newTask;
    },

    saveTask(newTask, id) {
        if (!newTask || !id) return null
        const listaAlvo = listCreated[id]
        listTaskCreated[newTask.id] = newTask
        listaAlvo.tasks.push(newTask);
        return newTask
    },

    complete(idList, idTask) {
        const listaAlvo = listCreated[idList].tasks;
        for (let task of listaAlvo) {
            if (task.id === idTask) {
                task.status === 'incompleted' ? task.status = 'completed' : task.status = 'incompleted';
                return task
            }
        }
    },

    updateTask(idList, idTask, newName = '', newDescription = '', newPriority = '', newDate = '') {
        const listaAlvo = listCreated[idList].tasks;
        for (let task of listaAlvo) {
            if (task.id === idTask) { 
                newName !== '' ? task.name = newName : null;
                newDescription !== '' ? task.description = newDescription : null;
                newPriority !== '' ? task.priority = newPriority : null;
                newDate !== '' ? task.dueDate = newDate : null;
                task.updateAt = new Date();

                return task
            }
        }},

        delete (idList, idTask){
            const listaAlvo = listCreated[idList].tasks
            console.log(idTask)
            if (listTaskCreated[idTask]) {
                delete listTaskCreated[idTask];
            }
            for (let { id } of listaAlvo) {
                if (id === idTask) {
                    const index = listaAlvo.indexOf(id);
                    listaAlvo.splice(index, 1);
                    break
                }
            }
        }
    }