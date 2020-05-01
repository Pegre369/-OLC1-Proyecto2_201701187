import {Router} from 'express';

class indexroutes{

    public router : Router = Router();

    constructor(){
        //agrega la ruta
        this.config();
    }

    //utilizar router y apartir de esa propiedad defiinir mis rutas
    config():void{
        this.router.get('/', (req, res)=> res.send('Hola'));
    }


}

const indexrout = new indexroutes();

//exportamos el enrutador
export default indexrout.router;