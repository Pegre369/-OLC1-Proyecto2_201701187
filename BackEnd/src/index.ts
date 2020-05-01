import express, {Application} from 'express';
import indexroutes from './routes/indexroutes';
import morgan from 'morgan';
import cors from 'cors';


class Server{

    //Sirve para llamarla en otro lados
    public app: Application;

    constructor() {
    
        //Para inicializarla con lo de express 
       this.app = express();

        //Para configurar app
        this.config();
        this.routes();
    }

    //Encargado de configurar el app
    config():void{
        this.app.set('port',3000);

        //sirve para ver las peticiones get post put delet
        this.app.use(morgan('dev'));

        //el servidor http puede pedir los datos a nuestro servidor 
        this.app.use(cors());

        //sirve aceptar formatos json de aplicaciones clientes
        this.app.use(express.json());

        //queremos enviar desde un formato html
        this.app.use(express.urlencoded({extended:false}));

    }

    //Rutas de mi servidor
    routes():void{
        this.app.use(indexroutes);
    }

    //Inicializa el servidor
    start():void{
        this.app.listen(this.app.get('port'),()=>{

            console.log('Server en el purto', this.app.get('port'))

        });
    }

}

//Inicialiso mi servidor
const server = new Server();

//Llamo a mi metodo de inicio
server.start();