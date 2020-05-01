"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class indexroutes {
    constructor() {
        this.router = express_1.Router();
        //agrega la ruta
        this.config();
    }
    //utilizar router y apartir de esa propiedad defiinir mis rutas
    config() {
        this.router.get('/', (req, res) => res.send('Hola'));
    }
}
const indexrout = new indexroutes();
//exportamos el enrutador
exports.default = indexrout.router;
