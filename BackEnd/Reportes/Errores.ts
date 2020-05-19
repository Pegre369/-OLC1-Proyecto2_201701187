import { NodoError } from './Nodo_Error';

class Errores extends Array<NodoError>{

    constructor(){
        super();
    }

    public static add(err:NodoError){
        this.prototype.push(err);
    }

    public static mostrar(){
        for(var i=0; i<this.prototype.length;i++){
        
        console.log(+this.prototype[i].getdescripcion()+" Tipo: "+this.prototype[i].gettipo()+" Linea: "+this.prototype[i].getlinea());
        
        }
    }
}

export{Errores};