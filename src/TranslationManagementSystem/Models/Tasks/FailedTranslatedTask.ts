import {ITask} from "./ITask";

class FailedTranslatedTask implements ITask {
    taskId: number;
    reason: string;


    constructor(taskId: number, reason: string) {

        this.taskId = taskId;
        this.reason = reason;
    }
}

export {FailedTranslatedTask}