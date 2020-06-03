import {Request, Response} from "express";
import knex from "../database/connection";

class ItemsController {


    async index(req: Request, res: Response){
            const itens = await knex('itens').select('*');

            const serializedItems = itens.map(itens => {
                return {
                    id: itens.id,
                    name: itens.title,
                    image_url: `http://localhost:3333/uploads/${itens.image}`,
                };
            });
            return res.json(serializedItems);
    }

}

export default new ItemsController();
