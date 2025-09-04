import express from 'express'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const file = fileURLToPath(import.meta.url);
const dir = path.dirname(file)

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(dir, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}))

const PORT = process.env.PORT ||  3000;
app.listen(PORT, () =>{
    console.log(`Servido Iniciado \nRodando em http://localhost:${PORT}`)
})
