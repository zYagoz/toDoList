import { v4 as uuidv4 } from 'uuid';
import { listModel } from "../models/listModel.js";

class taskUserCreate {
    constructor(name){
        this.id = uuidv4();
        this.name = name;
        this.status = incompleted;
        this.createdAt = new Date();
        this.updateAt = new Date();
    }
}

let listCreated = {};

export const tasksModel = {

    getAllTask(id){
        const listInput = listModel.getListById(id)
        return listInput.tasks
    }

}