import {inject, injectable} from "inversify";
import "reflect-metadata";
import {TranslationJob} from "../../Entities/TranslationJob";
import {IDataAccess} from "../../Common/DataAccess";
import {Types} from "../../Types";
import {TranslationTaskStatus} from "../Models/TranslationTaskStatus";
import {ITask} from "../Models/Tasks/ITask";
import {TranslatedTask} from "../Models/Tasks/TranslatedTask";
import {TranslationRequest} from "../../Entities/TranslationRequest";

export interface ITranslationTaskDao {

    /**
     * @param translationJob
     *
     * @return number
     */
    save(translationJob: TranslationJob): Promise<number>;

    /**
     * @param taskId
     * @param taskStatus
     *
     * @return void
     */
    updateTaskStatus(taskId: number, taskStatus: TranslationTaskStatus): Promise<void>;

    /**
     * @param jobId
     *
     * @return number
     */
    getUnSuccessTaskCount(jobId: string): Promise<number>;

    /**
     * @param taskId
     * @param translatedFileName
     * @param translatedFilePath
     *
     * @return void
     */
    updateTranslatedFile(taskId: number, translatedFileName: string, translatedFilePath: string): Promise<void>;

    getTranslatedTask(jobId: string): Promise<Array<TranslatedTask>>;
}

@injectable()
class TranslationTaskDao implements ITranslationTaskDao {

    private readonly dataAccess: IDataAccess;

    /**
     * @param dataAccess
     */
    constructor(@inject(Types.IDataAccess)dataAccess: IDataAccess) {
        this.dataAccess = dataAccess;
    }

    /**
     * @param translationJob
     * @return number
     */
    async save(translationJob: TranslationJob): Promise<number> {

        const insertSql = "INSERT INTO tms_task(task_id, job_id, email, source, target, original_file_name, original_file_path) " +
            "(SELECT nextval('tms_task_seq'), $1, $2, $3, $4, $5, $6 ) RETURNING task_id";
        let values = new Array<string>();
        let translationRequest = translationJob.translationRequest;
        values.push(translationJob.jobId)
        values.push(translationRequest.email);
        values.push(translationRequest.source);
        values.push(translationRequest.target);
        values.push(translationRequest.originalFileName);
        values.push(translationRequest.originalFilePath);

        let client = await this.dataAccess.getConnection();
        let taskId = 0;
        try {
            let queryResult = await client.query(insertSql, values);
            taskId = Number(queryResult.rows[0]['task_id']);
        } catch (e) {
            console.error(e.message);
        } finally {
            client.release();
        }
        return Promise.resolve(Number(taskId));
    }

    /**
     * @param taskId
     * @param taskStatus
     *
     * @return void
     */
    async updateTaskStatus(taskId: number, taskStatus: TranslationTaskStatus): Promise<void> {

        const updateSql = "UPDATE tms_task SET task_status = $1 WHERE task_id = $2"
        let values = [taskStatus, taskId];

        let client = await this.dataAccess.getConnection();
        try {
            await client.query(updateSql, values);
        } catch (e) {
            console.error(e.message);
        } finally {
            client.release();
        }

        return Promise.resolve(undefined);
    }

    /**
     * @param jobId
     *
     * @return number
     */
    async getUnSuccessTaskCount(jobId: string): Promise<number> {

        const sql = "SELECT COUNT(*) AS task_count FROM tms_task WHERE job_id = $1 AND task_status != $2";
        let values = [jobId, TranslationTaskStatus.Success];
        let client = await this.dataAccess.getConnection();
        try {
            let queryResult = await client.query(sql, values);
            if (queryResult != null) {

                return Promise.resolve(Number(queryResult.rows[0]['task_count']));
            }
        } catch (e) {
            console.error(e.message);
        } finally {
            client.release();
        }
        return Promise.resolve(Number.MAX_VALUE);
    }

    async updateTranslatedFile(taskId: number, translatedFileName: string, translatedFilePath: string): Promise<void> {

        const updateSql = "UPDATE tms_task SET translated_file_name = $1, translated_file_path = $2 WHERE task_id = $3";
        let values = [translatedFileName, translatedFilePath, taskId];

        let client = await this.dataAccess.getConnection();
        try {
            await client.query(updateSql, values);
        } catch (e) {
            console.error(e.message);
        } finally {
            client.release();
        }

        return Promise.resolve(undefined);
    }

    async getTranslatedTask(jobId: string): Promise<Array<TranslatedTask>> {

        const querySql = "SELECT * FROM tms_task WHERE job_id = $1";
        let values = [jobId];
        let result = new Array<TranslatedTask>();
        let client = await this.dataAccess.getConnection();
        try {
            let queryResult = await client.query(querySql, values);
            if (queryResult != null) {
                for(let i = 0; i < queryResult.rows.length; i++) {
                    let row: any = queryResult.rows[i];
                    result.push(new TranslatedTask(
                        Number(row['task_id']),
                        new TranslationRequest(
                            row['email'],
                            row['source'],
                            row['target'],
                            row['original_file_name'],
                            row['original_file_path']
                        ),
                        row['translated_file_name'],
                        row['translated_file_path']
                    ))
                }
            }
        } catch (e) {
            console.error(e.message);
        } finally {
            client.release();
        }

        return Promise.resolve(result);
    }
}

export {TranslationTaskDao};