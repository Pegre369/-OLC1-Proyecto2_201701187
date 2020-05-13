"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Nodo_Error = /** @class */ (function () {
    function Nodo_Error(tipo, descripcion, linea) {
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.linea = (linea + 1);
    }
    Nodo_Error.prototype.gettipo = function () {
        return this.tipo;
    };
    Nodo_Error.prototype.getdescripcion = function () {
        return this.descripcion;
    };
    Nodo_Error.prototype.getlinea = function () {
        return this.linea;
    };
    return Nodo_Error;
}());
exports.Nodo_Error = Nodo_Error;
