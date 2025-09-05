import { listModel } from "../models/listModel.js";

export const listController = {
    //GET
    index: (req, res) => {
        const lists = listModel.getAllList();
        res.render('index', { lists })
    },

    //GET / list/:id
    show: (req, res) => {
        const id = req.params.id;
        const list = listModel.getListById(id)
        res.render(`list`, { list })
    },

    //POST /list/create
    save: (req, res) => {
        const { name } = req.body
        const newList = listModel.createList(name)
        listModel.saveList(newList);
        res.redirect('/')
    },
    
    //POST /list/edit/:id
    
    //POST /list/update/:id
    update: (req, res) => {
        const id = req.params.id;
        listModel.updateList(id, 'HOLLOW PURPLE')
        res.redirect('/')
    },

    //POST /list/delete/:id
    delete: (req, res) => {
        const id = req.params.id;
        listModel.deleteList(id);
        res.redirect('/')
    }
}