import {Nodo_Error} from "./Nodo_Error"

class Reporte_Errores extends Array<Nodo_Error>{

    constructor(){
        super();
    }

    public static add(err:Nodo_Error){
        this.prototype.push(err);
    }


}