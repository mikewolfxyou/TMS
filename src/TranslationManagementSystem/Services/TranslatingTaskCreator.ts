import {inject, injectable} from "inversify";
import "reflect-metadata";
import {TranslationTask} from "../Models/Tasks/TranslationTask";
import {TranslatingTask} from "../Models/Tasks/TranslatingTask";
import {Types} from "../../Types";
import {ITranslationTaskRepository} from "../Repositories/TranslationTaskRepository";
import {TranslationTaskStatus} from "../Models/TranslationTaskStatus";
import {ITask} from "../Models/Tasks/ITask";

export interface ITranslatingTaskCreator {

    create(translationTask: TranslationTask) : Promise<ITask>;
}

@injectable()
class TranslatingTaskCreator implements ITranslatingTaskCreator {

    private readonly taskRepository: ITranslationTaskRepository;

    constructor(@inject(Types.ITranslationTaskRepository)taskRepository: ITranslationTaskRepository) {
        this.taskRepository = taskRepository;
    }

    async create(translationTask: TranslationTask): Promise<ITask> {
        try {
            await this.taskRepository.updateTaskStatus(translationTask.taskId, TranslationTaskStatus.Translating);
            return Promise.resolve(new TranslatingTask(
                translationTask.taskId,
                translationTask.translationRequest
            ));
        } catch (e) {
            console.error(e.message);
            throw e;
        }
    }
}

export {TranslatingTaskCreator}