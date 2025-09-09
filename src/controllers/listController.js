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
        const list = listModel.getListById(id);
        console.log('> show list, id=', id, ' list=', JSON.stringify(list, null, 2))
        res.render(`list`, { list, id })
    },

    //POST /list/create
    save: (req, res) => {
        const { name } = req.body
        const newList = listModel.createList(name)
        listModel.saveList(newList);
        res.redirect('/')
    },

    //POST /list/update/:id
    update: (req, res) => {
        const id = req.params.id;
        const referer = req.get('Referer');
        const { name } = req.body;
        if (!name || name.length < 3) {
            return res.status(400).send('O nome precisa ter pelo menos 4 caracteres')
        }
        listModel.updateList(id, name);
        referer.endsWith('/') ? res.redirect('/') : res.redirect(`/lists/${id}`);
    },
    
    //POST /list/status/:id
    updateStatus: (req,res) =>{
        const id = req.params.id;
        const referer = req.get('Referer');
        
        listModel.changeStatusList(id);
        referer.endsWith('/') ? res.redirect('/') : res.redirect(`/lists/${id}`);

        
    },

    //POST /list/delete/:id
    delete: (req, res) => {
        const id = req.params.id;
        listModel.deleteList(id);
        res.redirect('/')
    }
}