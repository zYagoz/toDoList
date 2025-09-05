import { listModel } from "../models/listModel.js"

export const listController = {
    //GET
    index: (req, res) =>{
        const lists = listModel.getAllList();
        res.render('index', {lists})
    },

    //GET / list/:id
    show: (req,res) =>{
        const id = req.params.id;
        const list = listModel.getListById(id)
        res.render(`list`, {list})
    }
}