import express from 'express'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import router from './routes.js';

const file = fileURLToPath(import.meta.url);
const dir = path.dirname(file)

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(dir, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}))

app.use(router)

const PORT = 3000;
app.listen(PORT, () =>{
    console.log(`Servido Iniciado \nRodando em http://localhost:${PORT}`)
})
