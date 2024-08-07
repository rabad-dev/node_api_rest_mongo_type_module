//importaciones de paquetes internos
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();


//importaciones archivos y/o paquetes personalizados
const bookRoutes = require('./routes/book.routes');



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


