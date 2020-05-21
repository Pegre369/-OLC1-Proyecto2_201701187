import express from 'express';
import * as bodyparser from "body-parser";  
import cors from 'cors';
import * as gramatica from"./Analizador/Analisis";
import { Errores } from './Reportes/Errores';

var app=express();
app.use(bodyparser.json());
app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));


app.post('/Analizar/', function (req, res) {
    var entrada=req.body.text;
    var resultado = prueba(entrada);
    
    if(Errores.Vacio()){

        Errores.mostrar();
        res.send(Errores.mostrar_Lista().toString());
        Errores.clear();

    }else{

        Errores.clear();
        var json = JSON.stringify(resultado,null,2);
        json = json.split('descripcion').join('text').split('lista_Nodo').join('children');
        console.log(json);
        res.send(json);

    }

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

