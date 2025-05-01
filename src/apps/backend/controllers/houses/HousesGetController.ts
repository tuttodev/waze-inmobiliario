import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import type { Controller } from '../Controller';
import {HousesGetter} from "@/features/get_houses/application/HousesGetter";
import {UserGetter} from "@/features/shared/domain/UserGetter";
import {PostgresDrizzleHouseRepository} from "@shared/infrastructure/PostgresDrizzleHouseRepository";
import {PostgresDrizzleUserRepository} from "@shared/infrastructure/PostgresDrizzleUserRepository";
import {drizzle} from "drizzle-orm/node-postgres";

export default class HousesGetController implements Controller {
    async run(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.query.userId as string;

            const dbClient = drizzle(process.env.DATABASE_URL!);

            const repository = new PostgresDrizzleHouseRepository(dbClient)
            const userRepository = new PostgresDrizzleUserRepository()
            const userGetter = new UserGetter(userRepository)

            const useCase = new HousesGetter(repository, userGetter)
            const response = await useCase.run({
                userId
            })

            res.status(httpStatus.OK).json(response.houses)
        } catch (error) {
            if (error instanceof Error) {
                res.status(httpStatus.NOT_FOUND).json({
                    message: error.message
                })

                return
            }

            res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
