import {Router} from 'express';
import {salidas} from'../Controllers/Salidas';


class indexroutes{

    public router : Router = Router();

    constructor(){
        //agrega la ruta
        this.config();
    }

    //utilizar router y apartir de esa propiedad defiinir mis rutas
    config():void{
        this.router.post('/prueba', salidas.index);
    }


}

const indexrout = new indexroutes();

//exportamos el enrutador
export default indexrout.router;