import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import type { Controller } from '../Controller';
import {InMemoryHouseRepository} from "@/features/shared/infrastructure/in_memory/InMemoryHouseRepository";
import {HouseUnPublisher} from "@/features/unpublish_houses/application/HouseUnPublisher";

export default class HousesDeleteController implements Controller {
    async run(req: Request, res: Response): Promise<void> {
        try {
            const query = req.query as Record<string, string>;
            const params = req.params as Record<string, string>;

            const houseRepository = new InMemoryHouseRepository()

            const useCase = new HouseUnPublisher(houseRepository);
            await useCase.run({
                houseId: params.houseId,
                reason: query.reason,
                userId: query.userId,
            })

            res.sendStatus(httpStatus.NO_CONTENT)
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('House with ID')) {
                    res.status(httpStatus.NOT_FOUND).json({
                        message: error.message
                    })

                    return
                } else if (error.message.includes('is not authorized to unpublish')) {
                    res.status(httpStatus.FORBIDDEN).json({
                        message: error.message
                    })

                    return
                }
            }

            res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
