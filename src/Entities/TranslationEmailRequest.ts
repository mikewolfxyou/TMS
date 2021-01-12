import {TranslatedTask} from "../TranslationManagementSystem/Models/Tasks/TranslatedTask";

class TranslationEmailRequest {

    public jobId: string;
    public email: string;
    public translationTasks: Array<TranslatedTask>


    constructor(jobId: string, email: string,  translationTasks: Array<TranslatedTask>) {
        this.jobId = jobId;
        this.email = email;
        this.translationTasks = translationTasks;
    }
}

export {TranslationEmailRequest}