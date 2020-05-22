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
var Reporte_funcion = "";
var r1:Narbol.Nodo_Arbol;
var r2:Narbol.Nodo_Arbol;
var MYFPrincipal:Array<String> =[];
var MYFfCopia:Array<String> =[];
var MYFfCopia_Clase:Array<String> =[];

app.post('/Analizar/', function (req, res) {

    var entrada=req.body.text1;
    var resultado = prueba(entrada);
    //console.log(resultado);

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
                
                r1 =resultado;
            
                //Apartado para el AST
                var tree1 = JSON.stringify(resultado,null,2);
                tree1 = tree1.split('descripcion').join('text').split('lista_Nodo').join('children');
                //console.log(tree1);

                //Apartado para llenar la lista de clases
                recorrer_tree_uno(resultado);
                Lista_clase_contadores_1.push(contador1);
                res.json({arbol: tree1, Rerror: "nada", Reporte_uno: "nada", Reporte_dos: "nada"});

            }else{
                
                Lista_clase_2 =[];
                Lista_clase_contadores_2=[];
                contador2 = 0;
                console.log("dos");

                r2 =resultado;
                
                //Apartado para el AST
                var tree2 = JSON.stringify(resultado,null,2);
                tree2 = tree2.split('descripcion').join('text').split('lista_Nodo').join('children');
                //console.log(tree2);
                
                //Apartado para Reportes
                recorrer_tree_dos(resultado);
                Lista_clase_contadores_2.push(contador2);
                Buscar_copia_clases();
                
                //console.log(r1);

                copiafyv(r1,r2);
                rec();
                
                res.json({arbol: tree2, Rerror: "nada2", Reporte_uno: Reporte_clase, Reporte_dos: Reporte_funcion});
            }

           
           

        

    }

});

/*----------------------------------------Reportes Copias clases--------------------------------*/

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

/*-----------------------------------------Reportes Copia Funciones y Variables----------------------*/
function copiafyv(principal:Narbol.Nodo_Arbol,copia:Narbol.Nodo_Arbol){

    /*Analizo primero el root principal */
    principal.lista_Nodo.forEach(element => {
        if (element.tipo=="Clase") {
            MYFPrincipal = [];
            MYFfCopia = [];
            /*por cada calse encontrada, la busco en el otro arbol*/ 
            copia.lista_Nodo.forEach(element2 => {
                if (element2.tipo=="Clase") {
                    /*Por cada clase que encuentro en el otro root compruebo si son los mismos*/ 
                    if (element.descripcion==element2.descripcion) {
                        /*recorro para encontrar los metodos y funciones de la clase principal*/
                        element.lista_Nodo.forEach(element3 => {
                            if(element3.tipo=="Funcion"){
                                MYFPrincipal.push(element3.descripcion);
                                /*encontramos si tiene parametros la funcion*/ 
                                element3.lista_Nodo.forEach(parametrosMF => {
                                    if(parametrosMF.tipo=="Parametros"){
                                        var parametroslst = returnLst(parametrosMF.lista_Nodo);
                                        element2.lista_Nodo.forEach(fmCopia => {
                                            if (fmCopia.tipo=="Funcion" && element3.tipodato==fmCopia.tipodato) {
                                                fmCopia.lista_Nodo.forEach(paramCopia => {
                                                    if (paramCopia.tipo=="Parametros"){
                                                        var parametroslstCopia = returnLst(paramCopia.lista_Nodo);
                                                        if (parametroslst.toString()==parametroslstCopia.toString()) {
                                                            console.log("las funciones "+element3.descripcion+" Son iguales en ambos archivos,por tener los mismos tipos de parametros en el mismo orden"+" de la calse "+element.descripcion);
                                                            MYFfCopia_Clase.push(element.descripcion);
                                                            MYFfCopia.push(element3.descripcion);
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }else if(element3.tipo=="Metodo"){
                                MYFPrincipal.push(element3.descripcion);
                                /*encontramos si tiene parametros la funcion*/ 
                                element3.lista_Nodo.forEach(parametrosF => {
                                    if(parametrosF.tipo=="Parametros"){
                                        var parametroslstM = returnLst(parametrosF.lista_Nodo);
                                        element2.lista_Nodo.forEach(mCopia => {
                                            if (mCopia.tipo=="Metodo" && element3.descripcion==mCopia.descripcion) {
                                                mCopia.lista_Nodo.forEach(paramCopiaM => {
                                                    if (paramCopiaM.tipo=="Parametros"){
                                                        var parametroslstCopiaM = returnLst(paramCopiaM.lista_Nodo);
                                                        if (parametroslstM.toString()==parametroslstCopiaM.toString()) {
                                                            console.log("los metodos "+element3.descripcion+" Son iguales en ambos archivos,por tener los mismos tipos de parametros en el mismo orden"+" de la calse "+element.descripcion);
                                                            MYFfCopia.push(element3.descripcion);
                                                            MYFfCopia.push(element3.descripcion);
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                        if(MYFPrincipal.toString()==MYFfCopia.toString()){
                            console.log("las clases "+element.descripcion+" Son iguales en ambos archivos");
                        }
                    }
                }
            });
        }
    });
}

function rec(){

    Reporte_funcion ="";
    Reporte_funcion = "<!DOCTYPE html> ";
    Reporte_funcion+="<html lang=\"en\">";
    Reporte_funcion+="<head>";
    Reporte_funcion+="<meta charset=\"UTF-8\">";
    Reporte_funcion+="<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">";
    Reporte_funcion+="<title>Reporte de Clases copia</title>";
    Reporte_funcion+="<link rel=\"stylesheet\" href=\"https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css\" integrity=\"sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh\" crossorigin=\"anonymous\">";
    Reporte_funcion+="<script src=\"https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js\" integrity=\"sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6\" crossorigin=\"anonymous\"></script>";
    Reporte_funcion+="</head>";
    Reporte_funcion+="<body>";
    Reporte_funcion+="<H1>Reporte de Funciones</H1>";
    Reporte_funcion+= "<table class=\"table\"><thead class=\"thead-dark\"> \n";
    Reporte_funcion+="<tr> \n";
    Reporte_funcion+= "<th scope=\"col\">#</th> \n";
    Reporte_funcion+= "<th scope=\"col\">Noombre del metodo o funcion copia</th> \n";
    Reporte_funcion+= "<th scope=\"col\">Clase copia a la que pertenecen</th> \n";
    Reporte_funcion+= "</tr> \n";
    Reporte_funcion+= "</thead> \n";
    Reporte_funcion+= "<tbody>";
    var No=1;
    for (let index = 0; index < MYFfCopia.length; index++) {
        
        Reporte_funcion+= "<tr> \n";
        Reporte_funcion+= "<th scope=\"row\">"+No+"</th> \n";
        Reporte_funcion+="<td>"+MYFfCopia[index]+"</td><td>"+
                               MYFfCopia_Clase[index]+"</td>\n";
        Reporte_funcion+="</tr>\n";
        No=No+1;

            console.log("------------------------------------------------");
            console.log(MYFfCopia[index]);
            console.log(MYFfCopia_Clase[index]);
            
    
    }    
    Reporte_funcion+= "</tbody> \n";
    Reporte_funcion+= "</table> \n";
                    
    Reporte_funcion+="</body>";
    Reporte_funcion+="</html>";
        
}

function returnLst(lstLista:Array<Narbol.Nodo_Arbol>):Array<String>{
    var temporalLst:Array<String>=[];
    if(lstLista.length>0){
        lstLista.forEach(element => {
            temporalLst.push(element.tipo);
        }); 
    }
    
    return temporalLst;
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

