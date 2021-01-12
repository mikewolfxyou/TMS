import {Pool, PoolClient} from 'pg';
import {IConfiguration} from "./Configuration";
import {DatabaseConfiguration} from './Models/DatabaseConfiguration';
import {inject, injectable} from "inversify";
import {Types} from "../Types";
import "reflect-metadata";

export interface IDataAccess{
    getConnection(): Promise<PoolClient>;
}

@injectable()
class DataAccess implements IDataAccess{

    private readonly configuration: IConfiguration;
    private readonly pool: Pool;

    constructor(@inject(Types.IConfiguration) configuration: IConfiguration) {

        this.configuration = configuration;
        let dataAccessConfig : DatabaseConfiguration = this.configuration.getConfig('DataAccess');

        this.pool = new Pool({
            user: dataAccessConfig.user,
            host: dataAccessConfig.host,
            database: dataAccessConfig.database,
            password: dataAccessConfig.password,
            port: dataAccessConfig.port
        });
    }

    async getConnection(): Promise<PoolClient> {

        return await this.pool.connect();
    }
}

export {DataAccess};