"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var bodyparser = __importStar(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var gramatica = __importStar(require("./Analizador/Analisis"));
var Errores_1 = require("./Reportes/Errores");
var app = express_1.default();
app.use(bodyparser.json());
app.use(cors_1.default());
app.use(bodyparser.urlencoded({ extended: true }));
var Lista_clase_1;
var Lista_clase_2;
var Lista_clase_contadores_1;
var Lista_clase_contadores_2;
var contador1;
var contador2;
var Reporte_clase = "";
var Reporte_funcion = "";
var r1;
var r2;
var MYFPrincipal = [];
var MYFfCopia = [];
var MYFfCopia_Clase = [];
app.post('/Analizar/', function (req, res) {
    var entrada = req.body.text1;
    var resultado = prueba(entrada);
    //console.log(resultado);
    if (Errores_1.Errores.Vacio()) {
        var nada = "";
        Errores_1.Errores.mostrar();
        res.json({ arbol: "nada", Rerror: Errores_1.Errores.mostrar_Lista().toString(), Reporte_uno: "nada", Reporte_dos: "nada" });
        Errores_1.Errores.clear();
    }
    else {
        Errores_1.Errores.clear();
        if (req.body.text2.toString() == "uno") {
            Lista_clase_1 = [];
            Lista_clase_contadores_1 = [];
            contador1 = 0;
            console.log("uno");
            r1 = resultado;
            //Apartado para el AST
            var tree1 = JSON.stringify(resultado, null, 2);
            tree1 = tree1.split('descripcion').join('text').split('lista_Nodo').join('children');
            //console.log(tree1);
            //Apartado para llenar la lista de clases
            recorrer_tree_uno(resultado);
            Lista_clase_contadores_1.push(contador1);
            res.json({ arbol: tree1, Rerror: "nada", Reporte_uno: "nada", Reporte_dos: "nada" });
        }
        else {
            Lista_clase_2 = [];
            Lista_clase_contadores_2 = [];
            contador2 = 0;
            console.log("dos");
            r2 = resultado;
            //Apartado para el AST
            var tree2 = JSON.stringify(resultado, null, 2);
            tree2 = tree2.split('descripcion').join('text').split('lista_Nodo').join('children');
            console.log(tree2);
            //Apartado para Reportes
            recorrer_tree_dos(resultado);
            Lista_clase_contadores_2.push(contador2);
            Buscar_copia_clases();
            //console.log(r1);
            copiafyv(r1, r2);
            rec();
            res.json({ arbol: tree2, Rerror: "nada2", Reporte_uno: Reporte_clase, Reporte_dos: Reporte_funcion });
        }
    }
});
/*----------------------------------------Reportes Copias clases--------------------------------*/
function recorrer_tree_uno(temporal) {
    if (temporal != null) {
        if (temporal.lista_Nodo != null && temporal.lista_Nodo.length > 0) {
            for (var index = 0; index < temporal.lista_Nodo.length; index++) {
                if (temporal.lista_Nodo[index] != null) {
                    try {
                        if (temporal.lista_Nodo[index].tipo == "Clase") {
                            Lista_clase_1.push(temporal.lista_Nodo[index].descripcion);
                            if (contador1 != 0) {
                                console.log("entra");
                                Lista_clase_contadores_1.push(contador1);
                                contador1 = 0;
                            }
                            console.log(" -> " + temporal.lista_Nodo[index].descripcion);
                        }
                        else if (temporal.lista_Nodo[index].tipo == "Funcion") {
                            console.log(" -> " + temporal.lista_Nodo[index].tipo);
                            contador1 = contador1 + 1;
                        }
                        else if (temporal.lista_Nodo[index].tipo == "Metodo") {
                            console.log(" -> " + temporal.lista_Nodo[index].tipo);
                            contador1 = contador1 + 1;
                        }
                    }
                    catch (error) {
                    }
                }
                recorrer_tree_uno(temporal.lista_Nodo[index]);
            }
        }
    }
    else {
        console.log("Entro");
    }
}
function recorrer_tree_dos(temporal) {
    if (temporal != null) {
        if (temporal.lista_Nodo != null && temporal.lista_Nodo.length > 0) {
            for (var index = 0; index < temporal.lista_Nodo.length; index++) {
                try {
                    if (temporal.lista_Nodo[index].tipo == "Clase") {
                        //console.log(" -> "+temporal.lista_Nodo[index].tipo)
                        Lista_clase_2.push(temporal.lista_Nodo[index].descripcion);
                        if (contador2 != 0) {
                            console.log("entra");
                            Lista_clase_contadores_2.push(contador2);
                            contador2 = 0;
                        }
                    }
                    else if (temporal.lista_Nodo[index].tipo == "Funcion") {
                        contador2 = contador2 + 1;
                    }
                    else if (temporal.lista_Nodo[index].tipo == "Metodo") {
                        contador2 = contador2 + 1;
                    }
                }
                catch (error) {
                }
                recorrer_tree_dos(temporal.lista_Nodo[index]);
            }
        }
    }
}
function Buscar_copia_clases() {
    Reporte_clase = "";
    Reporte_clase = "<!DOCTYPE html> ";
    Reporte_clase += "<html lang=\"en\">";
    Reporte_clase += "<head>";
    Reporte_clase += "<meta charset=\"UTF-8\">";
    Reporte_clase += "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">";
    Reporte_clase += "<title>Reporte de Clases copia</title>";
    Reporte_clase += "<link rel=\"stylesheet\" href=\"https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css\" integrity=\"sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh\" crossorigin=\"anonymous\">";
    Reporte_clase += "<script src=\"https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js\" integrity=\"sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6\" crossorigin=\"anonymous\"></script>";
    Reporte_clase += "</head>";
    Reporte_clase += "<body>";
    Reporte_clase += "<H1>Reporte de Clases</H1>";
    Reporte_clase += "<table class=\"table\"><thead class=\"thead-dark\"> \n";
    Reporte_clase += "<tr> \n";
    Reporte_clase += "<th scope=\"col\">#</th> \n";
    Reporte_clase += "<th scope=\"col\">Noombre</th> \n";
    Reporte_clase += "<th scope=\"col\">Metodos/funciones archivo 1</th> \n";
    Reporte_clase += "<th scope=\"col\">Metodos/funciones archivo 2</th> \n";
    Reporte_clase += "</tr> \n";
    Reporte_clase += "</thead> \n";
    Reporte_clase += "<tbody>";
    var No = 1;
    for (var index = 0; index < Lista_clase_1.length; index++) {
        for (var index2 = 0; index2 < Lista_clase_2.length; index2++) {
            if (Lista_clase_1[index] == Lista_clase_2[index2]) {
                Reporte_clase += "<tr> \n";
                Reporte_clase += "<th scope=\"row\">" + No + "</th> \n";
                Reporte_clase += "<td>" + Lista_clase_1[index] + "</td><td>" +
                    Lista_clase_contadores_1[index] + "</td><td>" +
                    Lista_clase_contadores_2[index2] + "</td>\n";
                Reporte_clase += "</tr>\n";
                No = No + 1;
                console.log("Se encontro copia de una clase: " + Lista_clase_2[index2]);
                console.log("Metodos Archivo1 : " + Lista_clase_contadores_1[index]);
                console.log("Metodos Archivo2 : " + Lista_clase_contadores_2[index2]);
            }
        }
    }
    Reporte_clase += "</tbody> \n";
    Reporte_clase += "</table> \n";
    Reporte_clase += "</body>";
    Reporte_clase += "</html>";
}
/*-----------------------------------------Reportes Copia Funciones y Variables----------------------*/
function copiafyv(principal, copia) {
    try {
        /*Analizo primero el root principal */
        principal.lista_Nodo.forEach(function (element) {
            if (element.tipo == "Clase") {
                MYFPrincipal = [];
                MYFfCopia = [];
                /*por cada calse encontrada, la busco en el otro arbol*/
                copia.lista_Nodo.forEach(function (element2) {
                    if (element2.tipo == "Clase") {
                        /*Por cada clase que encuentro en el otro root compruebo si son los mismos*/
                        if (element.descripcion == element2.descripcion) {
                            /*recorro para encontrar los metodos y funciones de la clase principal*/
                            element.lista_Nodo.forEach(function (element3) {
                                if (element3.tipo == "Funcion") {
                                    MYFPrincipal.push(element3.descripcion);
                                    /*encontramos si tiene parametros la funcion*/
                                    element3.lista_Nodo.forEach(function (parametrosMF) {
                                        if (parametrosMF.tipo == "Parametros") {
                                            var parametroslst = returnLst(parametrosMF.lista_Nodo);
                                            element2.lista_Nodo.forEach(function (fmCopia) {
                                                if (fmCopia.tipo == "Funcion" && element3.tipodato == fmCopia.tipodato) {
                                                    fmCopia.lista_Nodo.forEach(function (paramCopia) {
                                                        if (paramCopia.tipo == "Parametros") {
                                                            var parametroslstCopia = returnLst(paramCopia.lista_Nodo);
                                                            if (parametroslst.toString() == parametroslstCopia.toString()) {
                                                                console.log("las funciones " + element3.descripcion + " Son iguales en ambos archivos,por tener los mismos tipos de parametros en el mismo orden" + " de la calse " + element.descripcion);
                                                                MYFfCopia_Clase.push(element.descripcion);
                                                                MYFfCopia.push(element3.descripcion);
                                                            }
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                                else if (element3.tipo == "Metodo") {
                                    MYFPrincipal.push(element3.descripcion);
                                    /*encontramos si tiene parametros la funcion*/
                                    element3.lista_Nodo.forEach(function (parametrosF) {
                                        if (parametrosF.tipo == "Parametros") {
                                            var parametroslstM = returnLst(parametrosF.lista_Nodo);
                                            element2.lista_Nodo.forEach(function (mCopia) {
                                                if (mCopia.tipo == "Metodo" && element3.descripcion == mCopia.descripcion) {
                                                    mCopia.lista_Nodo.forEach(function (paramCopiaM) {
                                                        if (paramCopiaM.tipo == "Parametros") {
                                                            var parametroslstCopiaM = returnLst(paramCopiaM.lista_Nodo);
                                                            if (parametroslstM.toString() == parametroslstCopiaM.toString()) {
                                                                console.log("los metodos " + element3.descripcion + " Son iguales en ambos archivos,por tener los mismos tipos de parametros en el mismo orden" + " de la calse " + element.descripcion);
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
                            if (MYFPrincipal.toString() == MYFfCopia.toString()) {
                                console.log("las clases " + element.descripcion + " Son iguales en ambos archivos");
                            }
                        }
                    }
                });
            }
        });
    }
    catch (error) {
    }
}
function rec() {
    Reporte_funcion = "";
    Reporte_funcion = "<!DOCTYPE html> ";
    Reporte_funcion += "<html lang=\"en\">";
    Reporte_funcion += "<head>";
    Reporte_funcion += "<meta charset=\"UTF-8\">";
    Reporte_funcion += "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">";
    Reporte_funcion += "<title>Reporte de Clases copia</title>";
    Reporte_funcion += "<link rel=\"stylesheet\" href=\"https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css\" integrity=\"sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh\" crossorigin=\"anonymous\">";
    Reporte_funcion += "<script src=\"https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js\" integrity=\"sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6\" crossorigin=\"anonymous\"></script>";
    Reporte_funcion += "</head>";
    Reporte_funcion += "<body>";
    Reporte_funcion += "<H1>Reporte de Funciones</H1>";
    Reporte_funcion += "<table class=\"table\"><thead class=\"thead-dark\"> \n";
    Reporte_funcion += "<tr> \n";
    Reporte_funcion += "<th scope=\"col\">#</th> \n";
    Reporte_funcion += "<th scope=\"col\">Noombre del metodo o funcion copia</th> \n";
    Reporte_funcion += "<th scope=\"col\">Clase copia a la que pertenecen</th> \n";
    Reporte_funcion += "</tr> \n";
    Reporte_funcion += "</thead> \n";
    Reporte_funcion += "<tbody>";
    var No = 1;
    for (var index = 0; index < MYFfCopia.length; index++) {
        Reporte_funcion += "<tr> \n";
        Reporte_funcion += "<th scope=\"row\">" + No + "</th> \n";
        Reporte_funcion += "<td>" + MYFfCopia[index] + "</td><td>" +
            MYFfCopia_Clase[index] + "</td>\n";
        Reporte_funcion += "</tr>\n";
        No = No + 1;
        console.log("------------------------------------------------");
        console.log(MYFfCopia[index]);
        console.log(MYFfCopia_Clase[index]);
    }
    Reporte_funcion += "</tbody> \n";
    Reporte_funcion += "</table> \n";
    Reporte_funcion += "</body>";
    Reporte_funcion += "</html>";
}
function returnLst(lstLista) {
    var temporalLst = [];
    if (lstLista.length > 0) {
        lstLista.forEach(function (element) {
            temporalLst.push(element.tipo);
        });
    }
    return temporalLst;
}
var server = app.listen(9000, function () {
    console.log('Servidor escuchando en puerto 9000...');
});
function prueba(texto) {
    try {
        return gramatica.parse(texto);
    }
    catch (error) {
        return "Error en compilacion de Entrada: " + error.toString();
    }
}
