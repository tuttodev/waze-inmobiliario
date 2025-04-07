import bodyParser from 'body-parser';
import express, {type Request, type Response, type NextFunction} from 'express';
import Router from 'express-promise-router';
import type * as http from 'http';
import httpStatus from 'http-status';
import fileUpload from 'express-fileupload';
import { registerRoutes } from './routes';

export class Server {
    private readonly express: express.Express;
    private readonly port: string;
    private httpServer?: http.Server;

    constructor(port: string) {
        this.port = port;
        this.express = express();
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: true }));
        this.express.use(fileUpload() as never);
        const router = Router();
        this.express.use('/v1', router);

        registerRoutes(router);

        router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            console.log(err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message);
        });
    }

    async listen(): Promise<void> {
        await new Promise(resolve => {
            this.httpServer = this.express.listen(this.port, () => {
                console.log(
                    `  Mock Backend App is running at http://localhost:${this.port} in ${this.express.get('env')} mode`
                );
                console.log('  Press CTRL-C to stop\n');
                resolve(null);
            });
        });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- The response type is very large
    getHTTPServer() {
        return this.httpServer;
    }

    async stop(): Promise<void> {
        await new Promise((resolve, reject) => {
            if (this.httpServer != null) {
                this.httpServer.close(error => {
                    if (error != null) {
                        reject(error); return;
                    }
                    resolve(null);
                });
            }

            resolve(null);
        });
    }
}
