//importaciones de paquetes internos
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

//importaciones archivos y/o paquetes personalizados
import bookRoutes from './routes/book.routes.js';



const app = express();
app.use(bodyParser.json());

//Conectamos con la BBDD
mongoose.connect(process.env.DB_URL, {dbName: process.env.DB_NAME});
const db = mongoose.connection;

//usamos las rutas importadas
app.use('/books',bookRoutes);

//Llamamos el puerto desde variable de entorno.
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Servidor escuchando en puerto ${port}`);
}) ;


