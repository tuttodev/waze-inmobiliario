import type { Router } from 'express';
import { globSync } from 'glob';

export function registerRoutes(router: Router): void {
    const routes = globSync(__dirname + '/**/*.route.*');
    routes.forEach(route => { register(route, router); });
}

function register(routePath: string, router: Router): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- This is a dynamic require
    const route = require(routePath);
    route.register(router);
}
