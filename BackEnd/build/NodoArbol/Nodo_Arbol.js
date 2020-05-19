"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Nodo_Arbol = /** @class */ (function () {
    function Nodo_Arbol(tipoC, des, idC) {
        this.lista_Nodo = [];
        this.tipo = tipoC;
        this.descripcion = des;
        this.id = idC;
    }
    Nodo_Arbol.prototype.encontrarNode = function (listaNodo) {
        for (var i = 0; i < listaNodo.length; i++) {
            this.lista_Nodo.push(listaNodo[i]);
        }
    };
    return Nodo_Arbol;
}());
exports.Nodo_Arbol = Nodo_Arbol;
