import type { Router } from 'express';
import { register as StatusRegister } from './status.route'
import { register as HousesRegister } from './houses.route'

export function registerRoutes(router: Router): void {
    StatusRegister(router);
    HousesRegister(router);
}
