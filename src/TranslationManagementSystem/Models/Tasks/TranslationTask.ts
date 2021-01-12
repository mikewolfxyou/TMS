import {TranslationRequest} from "../../../Entities/TranslationRequest";
import {ITask} from "./ITask";

class TranslationTask implements ITask {

    taskId: number;
    jobId: string;
    translationRequest: TranslationRequest;


    constructor(taskId: number, jobId: string, translationRequest: TranslationRequest) {
        this.taskId = taskId;
        this.jobId = jobId;
        this.translationRequest = translationRequest;
    }
}

export {TranslationTask}