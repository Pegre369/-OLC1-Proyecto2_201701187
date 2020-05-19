export class Nodo_Arbol{
    public id:number;
    public descripcion:string;
    public tipo:string;
    public lista_Nodo:Array<Nodo_Arbol>

    constructor(tipoC:string,des:string,idC:number){
        this.lista_Nodo = [];
        this.tipo = tipoC;
        this.descripcion=des;
        this.id = idC;
    }

    encontrarNode(listaNodo:Array<Nodo_Arbol>){
        for(let i=0;i<listaNodo.length;i++){
            this.lista_Nodo.push(listaNodo[i]);
        }
    }
}