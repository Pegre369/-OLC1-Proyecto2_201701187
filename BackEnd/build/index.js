"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const indexroutes_1 = __importDefault(require("./routes/indexroutes"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
class Server {
    constructor() {
        //Para inicializarla con lo de express 
        this.app = express_1.default();
        //Para configurar app
        this.config();
        this.routes();
    }
    //Encargado de configurar el app
    config() {
        this.app.set('port', 3000);
        //sirve para ver las peticiones get post put delet
        this.app.use(morgan_1.default('dev'));
        //el servidor http puede pedir los datos a nuestro servidor 
        this.app.use(cors_1.default());
        //sirve aceptar formatos json de aplicaciones clientes
        this.app.use(express_1.default.json());
        //queremos enviar desde un formato html
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    //Rutas de mi servidor
    routes() {
        this.app.use(indexroutes_1.default);
    }
    //Inicializa el servidor
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server en el purto', this.app.get('port'));
        });
    }
}
//Inicialiso mi servidor
const server = new Server();
//Llamo a mi metodo de inicio
server.start();
