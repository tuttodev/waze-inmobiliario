import { Server } from './server';

export class LambdaApp {
    server?: Server;

    async start(): Promise<void> {
        this.server = new Server();
    }

    get httpServer() {
        return this.server!.getHTTPServer()!;
    }
}
