import {inject, injectable} from "inversify";
import {IEmailServiceDao} from "../DataAccess/EmailServiceDao";
import {Types} from "../../Types";
import "reflect-metadata";

export interface IEmailServiceRepository {

    save(jobId: string, email: string): Promise<string>;
}

@injectable()
class EmailServiceRepository implements IEmailServiceRepository {

    private readonly emailServiceDao : IEmailServiceDao;

    constructor(@inject(Types.IEmailServiceDao)emailServiceDao: IEmailServiceDao) {

        this.emailServiceDao = emailServiceDao;
    }

    async save(jobId: string, email: string): Promise<string> {

        return Promise.resolve(await this.emailServiceDao.save(jobId, email));
    }
}

export {EmailServiceRepository}