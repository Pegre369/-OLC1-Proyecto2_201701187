"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Salidas_1 = require("../Controllers/Salidas");
class indexroutes {
    constructor() {
        this.router = express_1.Router();
        //agrega la ruta
        this.config();
    }
    //utilizar router y apartir de esa propiedad defiinir mis rutas
    config() {
        this.router.post('/prueba', Salidas_1.salidas.index);
    }
}
const indexrout = new indexroutes();
//exportamos el enrutador
exports.default = indexrout.router;
