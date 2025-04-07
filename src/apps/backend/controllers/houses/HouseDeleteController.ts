import type { Request, Response } from 'express';
import type { Controller } from '../Controller';

export default class HousesDeleteController implements Controller {
    async run(req: Request, res: Response): Promise<void> {
        throw new Error('not implemented');
    }
}
