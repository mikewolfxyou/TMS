import express from 'express';
import bodyParser from 'body-parser';

class App {

    public app: express.Application;
    public port: number;

    constructor(controllers : any, port: number) {

        this.app = express();
        this.port = port
        this.config();
        this.allRoutes(controllers);
    }

    private config(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
    }

    private allRoutes(controllers: any): void {
        controllers.forEach( (controller: any) => {
            this.app.use('/', controller.router);
        })
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`Translation Submitter API listening on the port ${this.port}`);
        });
    }
}

export {App};