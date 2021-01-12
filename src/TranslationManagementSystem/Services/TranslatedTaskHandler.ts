import {inject, injectable} from "inversify";
import "reflect-metadata";
import {ITask} from "../Models/Tasks/ITask";
import {TranslatedTask} from "../Models/Tasks/TranslatedTask";
import {FailedTranslatedTask} from "../Models/Tasks/FailedTranslatedTask";
import {ITranslationTaskRepository} from "../Repositories/TranslationTaskRepository";
import {TranslationTaskStatus} from "../Models/TranslationTaskStatus";
import {Types} from "../../Types";

export interface ITranslatedTaskHandler {

    handleTranslatedTask(translatedTask: ITask): Promise<boolean>;
}

@injectable()
class TranslatedTaskHandler implements ITranslatedTaskHandler {

    private readonly translationTaskRepository : ITranslationTaskRepository;

    constructor(@inject(Types.ITranslationTaskRepository)translationTaskRepository: ITranslationTaskRepository) {

        this.translationTaskRepository = translationTaskRepository;
    }

    async handleTranslatedTask(translatedTask: ITask): Promise<boolean> {

        //TODO dirty code!!!, should create a function map and move two private function out of this class
        if (translatedTask instanceof TranslatedTask) {

            return await this.updateTranslatedTask(translatedTask);
        }

        return await this.updateFailedTask(translatedTask);
    }

    async updateTranslatedTask(translatedTask: ITask): Promise<boolean> {

        let task = translatedTask as TranslatedTask;

        await this.translationTaskRepository.updateTranslatedFile(task.taskId, task.translatedFileName, task.translatedFilePath);
        await this.translationTaskRepository.updateTaskStatus(task.taskId, TranslationTaskStatus.Success);

        return Promise.resolve(true);
    }

    async updateFailedTask(translatedTask: ITask): Promise<boolean> {

        let task = translatedTask as FailedTranslatedTask;
        await this.translationTaskRepository.updateTaskStatus(task.taskId, TranslationTaskStatus.Failed);

        return Promise.resolve(false);
    }
}

export {TranslatedTaskHandler}