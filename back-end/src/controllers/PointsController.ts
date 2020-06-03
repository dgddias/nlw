import {Request, Response} from "express";
import knex from "../database/connection";

class PointsController {

    async create(req: Request, res: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            itens,
        } = req.body;


        const trx = await knex.transaction();


        const point = {
            image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
        };

        const insertedIds = await trx('points').insert(point);


        const point_id = insertedIds[0];

        const pointItens = itens.map((item_id: number) => {
            return {
                item_id,
                point_id
            }
        });

        await trx('point_itens').insert(pointItens);

        await trx.commit();

        return res.json({
            id:point_id,
            ...point,
        });

    }

    async show(req: Request, res: Response){
        const {id} = req.params;

        const point = await knex('points').where('id', id).first();

        if(!point){
            return res.status(400).json({
                message: 'point not found'
            });
        }

        const itens = await knex('itens').join('point_itens',
            'itens.id', '=', 'point_itens.item_id').where('point_itens.point_id', id)
            .select('itens.title');


        return res.json({
            point,
            itens
        });
    }

    async index(req: Request, res: Response) {

        const {city, uf, itens} = req.query;

        const parsedItems = String(itens).split(',').map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_itens', 'points.id', '=', 'point_itens.point_id')
            .whereIn('point_itens.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

       return  res.json(points);

    }

}

export default new PointsController();
