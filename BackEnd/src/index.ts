import express from 'express';
import * as bodyparser from "body-parser";  
import cors from 'cors';

var app=express();
app.use(bodyparser.json());
app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));


app.post('/Calcular/', function (req, res) {
    var entrada=req.body.text;
    var resultado = prueba(entrada);
    res.send(resultado.toString());
});



var server = app.listen(8080, function () {
    console.log('Servidor escuchando en puerto 8080...');
});

function prueba(texto:string){
    var conect = texto;
    return conect;
}

