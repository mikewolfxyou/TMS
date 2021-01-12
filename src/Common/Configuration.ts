import nconf from 'nconf';
import path from "path";
import {injectable} from "inversify";
import "reflect-metadata";

export interface IConfiguration {
    getConfig(key: string) :any;
}

@injectable()
class Configuration implements IConfiguration {

    private readonly configDir : string;
    private readonly prodConfig: string;
    private readonly devConfig: string;
    private readonly localConfig: string;

    constructor() {
        //TODO the configDir should be injected
        this.configDir = path.join(__dirname, '../TranslationSubmitter/Settings');
        this.prodConfig = path.join(this.configDir, 'appsettings.prod.json');
        this.devConfig = path.join(this.configDir, 'appsettings.dev.json');
        this.localConfig = path.join(this.configDir, 'appsettings.json');

        //TODO could be better way use the ENV
        if (process.env.npm_lifecycle_event == 'prod') {
            nconf.add('prod', {type: 'file', file: this.prodConfig});
        }

        if (process.env.npm_lifecycle_event == 'dev') {
            nconf.add('dev', {type: 'file', file: this.devConfig});
        }

        nconf.add('local', {type: 'file', file: this.localConfig});
        nconf.load();
    }

    getConfig(key: string): any {

       return nconf.get(key);
    }
}

export {Configuration};