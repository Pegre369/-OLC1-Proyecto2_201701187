import express from 'express';
import * as bodyparser from "body-parser";  
import cors from 'cors';
import * as gramatica from"./Analizador/Analisis";
import { Errores } from './Reportes/Errores';

var app=express();
app.use(bodyparser.json());
app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));


app.post('/Calcular/', function (req, res) {
    var entrada=req.body.text;
    var resultado = prueba(entrada);
    Errores.mostrar();
    res.send(resultado.toString());
});



var server = app.listen(8080, function () {
    console.log('Servidor escuchando en puerto 8080...');
});

function prueba(texto:string){
    try {
        return gramatica.parse(texto);

    } catch (error) {
        return "Error en compilacion de Entrada: "+ error.toString()
    }
}

