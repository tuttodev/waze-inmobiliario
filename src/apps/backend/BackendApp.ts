import { Server } from './server';

export class BackendApp {
    server?: Server;

    async start(): Promise<void> {
        const port = process.env.PORT ?? '2403';
        this.server = new Server(port);

        await this.server.listen();
    }

    get httpServer() {
        return this.server!.getHTTPServer()!;
    }

    async stop(): Promise<void> {
        await this.server?.stop();
    }
}
