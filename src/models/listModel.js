import { v4 as uuidv4 } from 'uuid';

class ListUserCreate {
    constructor(name) {
        this.id = uuidv4();
        this.name = name;
        this.status = 'incompleted';
        this.createdAt = new Date();
        this.updateAt = new Date();
        this.tasks = [];
    }
}

export let listCreated = {};

export const listModel = {
    getAllList() {
        return listCreated
    },

    getListById(id) {
        return listCreated[id];
            
    },

    createList(name) {
        const list = new ListUserCreate(name);
        return list
    },

    saveList(list) {
        listCreated[list.id] = list;
    },

    updateList(id, newName) {
        listCreated[id].name = newName;
        listCreated[id].updateAt = new Date();
    },

    changeStatusList(id) {
        if (listCreated[id] === 'incompleted') {
            listCreated[id].status = 'completed'
        } else {
            listCreated[id].status = 'incompleted'
        };
    },

    deleteList(id) {
        if (listCreated[id]) {
            delete listCreated[id];
            return true
        }
        return false
    }

}