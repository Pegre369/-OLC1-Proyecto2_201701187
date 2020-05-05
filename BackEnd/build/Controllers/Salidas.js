"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Salidas {
    index(req, res) {
        console.log(req.body.llave);
        res.json({ text: 'Si Jala' });
    }
}
exports.salidas = new Salidas();
