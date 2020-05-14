import {Nodo_Error} from "./Nodo_Error"

class Reporte_Errores extends Array<Nodo_Error>{

    constructor(){
        super();
    }

    public static add(err:Nodo_Error){
        this.prototype.push(err);
    }

    public static clear(){
        while(this.prototype.length>0){
            this.prototype.pop();
        }
    }
    
}
export{Reporte_Errores};