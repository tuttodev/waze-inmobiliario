import type { Router, Request, Response } from 'express';
import HousesGetController from "@/apps/backend/controllers/houses/HousesGetController";
import HousesPostController from "@/apps/backend/controllers/houses/HousePostController";
import HousesDeleteController from "@/apps/backend/controllers/houses/HouseDeleteController";
import HousesInterestPostController from "@/apps/backend/controllers/houses/HouseInterestPostController";

export const register = (router: Router): void => {
    const housesGetController = new HousesGetController()
    router.get('/houses', async (req: Request, res: Response): Promise<void> => { await housesGetController.run(req, res); });

    const housesPostController = new HousesPostController()
    router.post('/houses', async (req: Request, res: Response): Promise<void> => { await housesPostController.run(req, res); });

    const housesDeleteController = new HousesDeleteController()
    router.delete('/houses/:houseId', async (req: Request, res: Response): Promise<void> => { await housesDeleteController.run(req, res); });

    const housesInterestPostController = new HousesInterestPostController()
    router.post('/houses/:houseId/interest', async (req: Request, res: Response): Promise<void> => { await housesInterestPostController.run(req, res); });
};
