import {Request, Response } from 'express'

class Salidas {

    public index(req:Request, res:Response){
        
        console.log(req.body.llave);
        res.json({text:'Si Jala'})
        

    }



}

export const  salidas = new Salidas();

