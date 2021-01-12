import {TranslationRequest} from "../../../Entities/TranslationRequest";
import {ITask} from "./ITask";

class TranslatedTask implements ITask {
    taskId: number;
    translationRequest: TranslationRequest;
    translatedFileName: string;
    translatedFilePath: string;


    constructor(taskId: number, translationRequest: TranslationRequest, translatedFileName: string, translatedFilePath: string) {
        this.taskId = taskId;
        this.translationRequest = translationRequest;
        this.translatedFileName = translatedFileName;
        this.translatedFilePath = translatedFilePath;
    }
}

export {TranslatedTask}