import express from 'express';
import * as bodyparser from "body-parser";  
import cors from 'cors';
import * as gramatica from"./Analizador/Analisis";
import { Errores } from './Reportes/Errores';
import * as Narbol from './NodoArbol/Nodo_Arbol';

var app=express();
app.use(bodyparser.json());
app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));

var Lista_clase_1 : Array<String>;
var Lista_clase_2 : Array<String>;
var Lista_clase_contadores_1 : Array<number>;
var Lista_clase_contadores_2 : Array<number>;
var contador1:number;
var contador2:number;
var Reporte_clase = "";

app.post('/Analizar/', function (req, res) {
    var entrada=req.body.text1;
    var resultado = prueba(entrada);


    if(Errores.Vacio()){

        var nada = "";
        Errores.mostrar();
        res.json({arbol: nada,Rerror: Errores.mostrar_Lista().toString()});
        Errores.clear();

    }else{

        Errores.clear();
        
       
        
            if(req.body.text2.toString()=="uno"){

                Lista_clase_1 =[];
                Lista_clase_contadores_1=[];
                contador1 = 0;
                console.log("uno");

                //Apartado para el AST
                var tree1 = JSON.stringify(resultado,null,2);
                tree1 = tree1.split('descripcion').join('text').split('lista_Nodo').join('children');
                //console.log(tree1);

                //Apartado para llenar la lista de clases
                recorrer_tree_uno(resultado);
                Lista_clase_contadores_1.push(contador1);
                res.json({arbol: tree1, Rerror: "nada"});

            }else{
                
                Lista_clase_2 =[];
                Lista_clase_contadores_2=[];
                contador2 = 0;
                console.log("dos");

                //Apartado para el AST
                var tree2 = JSON.stringify(resultado,null,2);
                tree2 = tree2.split('descripcion').join('text').split('lista_Nodo').join('children');
                //console.log(tree2);
                
                //Apartado para Reportes
                recorrer_tree_dos(resultado);
                Lista_clase_contadores_2.push(contador2);
                Buscar_copia_clases();
                
                res.json({arbol: tree2, Rerror: "nada2", Reporte_uno: Reporte_clase});
            }

           
           

        

    }

});

/*----------------------------------------Reportes Copias--------------------------------*/



function recorrer_tree_uno(temporal:Narbol.Nodo_Arbol){
    
    if (temporal!=null) {
        if (temporal.lista_Nodo!=null && temporal.lista_Nodo.length>0) {
            for (let index = 0; index < temporal.lista_Nodo.length; index++) {

                if(temporal.lista_Nodo[index].tipo == "Clase"){
                
                    Lista_clase_1.push(temporal.lista_Nodo[index].descripcion);

                    if(contador1!=0){
                        
                        console.log("entra");
                        Lista_clase_contadores_1.push(contador1);
                        contador1 = 0;
                    
                    }
                    console.log(" -> "+temporal.lista_Nodo[index].descripcion)

                }else if(temporal.lista_Nodo[index].tipo == "Funcion"){

                    contador1 = contador1+1;

                }else if(temporal.lista_Nodo[index].tipo == "Metodo"){

                    contador1 = contador1+1;

                }
                   
                recorrer_tree_uno(temporal.lista_Nodo[index])

            }
        }
    }else{
        console.log("Entro");
    }
}

function recorrer_tree_dos(temporal:Narbol.Nodo_Arbol){
    if (temporal!=null) {
        if (temporal.lista_Nodo!=null && temporal.lista_Nodo.length>0) {
            for (let index = 0; index < temporal.lista_Nodo.length; index++) {

                if(temporal.lista_Nodo[index].tipo == "Clase"){

                    console.log(" -> "+temporal.lista_Nodo[index].tipo)
                    Lista_clase_2.push(temporal.lista_Nodo[index].descripcion);

                    if(contador2!=0){
                        console.log("entra");
                        Lista_clase_contadores_2.push(contador2);
                        contador2 = 0;
                    
                    }
                    
                    

                }else if(temporal.lista_Nodo[index].tipo == "Funcion"){

                    contador2 = contador2+1;

                }else if(temporal.lista_Nodo[index].tipo == "Metodo"){

                    contador2 = contador2+1;

                }
                   
                   
                recorrer_tree_dos(temporal.lista_Nodo[index])
               
            }
        }
    }
}

function Buscar_copia_clases(){

    Reporte_clase ="";
    Reporte_clase = "<!DOCTYPE html> ";
    Reporte_clase+="<html lang=\"en\">";
    Reporte_clase+="<head>";
    Reporte_clase+="<meta charset=\"UTF-8\">";
    Reporte_clase+="<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">";
    Reporte_clase+="<title>Reporte de Clases copia</title>";
    Reporte_clase+="<link rel=\"stylesheet\" href=\"https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css\" integrity=\"sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh\" crossorigin=\"anonymous\">";
    Reporte_clase+="<script src=\"https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js\" integrity=\"sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6\" crossorigin=\"anonymous\"></script>";
    Reporte_clase+="</head>";
    Reporte_clase+="<body>";
    Reporte_clase+="<H1>Reporte de Clases</H1>";
    Reporte_clase+= "<table class=\"table\"><thead class=\"thead-dark\"> \n";
    Reporte_clase+="<tr> \n";
    Reporte_clase+= "<th scope=\"col\">#</th> \n";
    Reporte_clase+= "<th scope=\"col\">Noombre</th> \n";
    Reporte_clase+= "<th scope=\"col\">Metodos/funciones archivo 1</th> \n";
    Reporte_clase+= "<th scope=\"col\">Metodos/funciones archivo 2</th> \n";
    Reporte_clase+= "</tr> \n";
    Reporte_clase+= "</thead> \n";
    Reporte_clase+= "<tbody>";
    var No=1;
    for (let index = 0; index < Lista_clase_1.length; index++) {
        
        for (let index2 = 0; index2 < Lista_clase_2.length; index2++) {
        
            if(Lista_clase_1[index] == Lista_clase_2[index2] ){

                Reporte_clase+= "<tr> \n";
                Reporte_clase+= "<th scope=\"row\">"+No+"</th> \n";
                Reporte_clase+="<td>"+Lista_clase_2[index2]+"</td><td>"+
                            Lista_clase_contadores_1[index]+"</td><td>"+
                            Lista_clase_contadores_2[index2]+"</td>\n";
                Reporte_clase+="</tr>\n";
                No=No+1;

                console.log("Se encontro copia de una clase: "+ Lista_clase_2[index2] );
                console.log("Metodos Archivo1 : "+ Lista_clase_contadores_1[index] );
                console.log("Metodos Archivo2 : "+ Lista_clase_contadores_2[index2] );

            }
    
        }    
        Reporte_clase+= "</tbody> \n";
        Reporte_clase+= "</table> \n";
                    
        Reporte_clase+="</body>";
        Reporte_clase+="</html>";
    
        
    } 

}


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

