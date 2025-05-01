import type { Router, Request, Response } from 'express';
import StatusGetController from '../controllers/SatusGetController';

export const register = (router: Router): void => {
    const controller = new StatusGetController()
    router.get('/status', async (req: Request, res: Response): Promise<void> => { await controller.run(req, res); });
};
