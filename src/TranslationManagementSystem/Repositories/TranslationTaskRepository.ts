import {inject, injectable} from "inversify";
import "reflect-metadata";
import {Types} from "../../Types";
import {ITranslationTaskDao} from "../DataAccess/TranslationTaskDao";
import {TranslationJob} from "../../Entities/TranslationJob";
import {TranslationTaskStatus} from "../Models/TranslationTaskStatus";
import {TranslatedTask} from "../Models/Tasks/TranslatedTask";
import {createEvalAwarePartialHost} from "ts-node/dist/repl";

export interface ITranslationTaskRepository {

    /**
     * @param translationJob
     *
     * @return number
     */
    save(translationJob: TranslationJob): Promise<number>;

    /**
     * @param taskId
     * @param translationTaskStatus
     *
     * @return void
     */
    updateTaskStatus(taskId: number, translationTaskStatus: TranslationTaskStatus): Promise<void>;

    /**
     * @param jobId
     *
     * @return void
     */
    isAllJobDone(jobId: string): Promise<boolean>;

    /**
     * @param taskId
     * @param translatedFileName
     * @param translatedFilePath
     *
     * @return void
     */
    updateTranslatedFile(taskId: number, translatedFileName: string, translatedFilePath:string): Promise<void>;

    /**
     * @param jobId
     *
     * @return Array<TranslatedTask>
     */
    getAllTask(jobId: string): Promise<Array<TranslatedTask>>;
}

@injectable()
class TranslationTaskRepository implements ITranslationTaskRepository{

    private readonly dao : ITranslationTaskDao;

    /**
     * @param dao
     */
    constructor(@inject(Types.ITranslationTaskDao)dao: ITranslationTaskDao) {
        this.dao = dao;
    }

    /**
     * @param translationJob
     *
     * @return number
     */
    async save(translationJob: TranslationJob): Promise<number> {

        let taskId = await this.dao.save(translationJob);

        return Promise.resolve(Number(taskId));
    }

    /**
     * @param taskId
     * @param translationTaskStatus
     *
     * @return void
     */
    async updateTaskStatus(taskId: number, translationTaskStatus: TranslationTaskStatus): Promise<void> {

        await this.dao.updateTaskStatus(taskId, translationTaskStatus);
        return Promise.resolve(undefined);
    }

    /**
     * @param jobId
     *
     * @return boolean
     */
    async isAllJobDone(jobId: string): Promise<boolean> {

        return Promise.resolve(await this.dao.getUnSuccessTaskCount(jobId) == 0);
    }

    async updateTranslatedFile(taskId: number, translatedFileName: string, translatedFilePath: string): Promise<void> {

        await this.dao.updateTranslatedFile(taskId, translatedFileName, translatedFilePath);
        return Promise.resolve(undefined);
    }

    async getAllTask(jobId: string): Promise<Array<TranslatedTask>> {

        return Promise.resolve(await this.dao.getTranslatedTask(jobId));
    }
}

export {TranslationTaskRepository}
