import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import type { Controller } from '../Controller';
import {HouseInterestMarker} from "@/features/mark_interest_houses/application/HouseInterestMarker";
import {UserGetter} from "@/features/shared/domain/UserGetter";
import {PostgresDrizzleHouseRepository} from "@shared/infrastructure/PostgresDrizzleHouseRepository";
import {PostgresDrizzleUserRepository} from "@shared/infrastructure/PostgresDrizzleUserRepository";

export default class HousesInterestPostController implements Controller {
    async run(req: Request, res: Response): Promise<void> {
        try {
            const { houseId } = req.params as Record<string, string>;
            const { userId } = req.query as Record<string, string>;

            const houseRepository = new PostgresDrizzleHouseRepository()
            const userRepository = new PostgresDrizzleUserRepository()

            const userGetter = new UserGetter(userRepository)

            const useCase = new HouseInterestMarker(houseRepository, userRepository, userGetter);
            await useCase.run({
                userId,
                houseId
            })

            res.sendStatus(httpStatus.OK)
        } catch (error) {
            if (error instanceof Error) {
                res.status(httpStatus.BAD_REQUEST).json({
                    message: error.message
                })

                return
            }

            res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
