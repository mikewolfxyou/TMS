import {inject, injectable} from "inversify";
import {IDataAccess} from "../../Common/DataAccess";
import {Types} from "../../Types";
import "reflect-metadata";

export interface IEmailServiceDao {

    save(jobId: string, email: string): Promise<string>;
}

@injectable()
class EmailServiceDao implements IEmailServiceDao {

    private readonly dataAccess: IDataAccess;

    constructor(@inject(Types.IDataAccess)dataAccess: IDataAccess) {
        this.dataAccess = dataAccess;
    }

    async save(jobId: string, email: string): Promise<string> {
        const insertSql = "INSERT INTO tms_email_service (job_id, email)VALUES ($1, $2) RETURNING job_id";
        let values = [jobId, email];

        let client = await this.dataAccess.getConnection();
        try {

            let insertResult = await client.query(insertSql, values);
            if (insertResult != null) {

                return insertResult.rows[0]['job_id'];
            }
        } catch (e) {
            console.info("When insert new job to email service table: " + e.message);
        } finally {
            client.release();
        }

        return Promise.resolve("");
    }
}

export {EmailServiceDao}