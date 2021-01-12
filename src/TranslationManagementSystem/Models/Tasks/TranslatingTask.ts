import {TranslationRequest} from "../../../Entities/TranslationRequest";
import {ITask} from "./ITask";

class TranslatingTask implements ITask {
    taskId: number;
    translationRequest: TranslationRequest;


    constructor(taskId: number, translationRequest: TranslationRequest) {
        this.taskId = taskId;
        this.translationRequest = translationRequest;
    }
}

export {TranslatingTask}