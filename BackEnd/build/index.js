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
app.post('/Analizar/', function (req, res) {
    var entrada = req.body.text;
    var resultado = prueba(entrada);
    Errores_1.Errores.mostrar();
    res.send(Errores_1.Errores.mostrar_Lista().toString());
});
var server = app.listen(8080, function () {
    console.log('Servidor escuchando en puerto 8080...');
});
function prueba(texto) {
    try {
        return gramatica.parse(texto);
    }
    catch (error) {
        return "Error en compilacion de Entrada: " + error.toString();
    }
}
