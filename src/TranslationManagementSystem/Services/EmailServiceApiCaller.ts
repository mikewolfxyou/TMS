import {inject, injectable} from "inversify";
import "reflect-metadata";
import {ITranslationTaskRepository} from "../Repositories/TranslationTaskRepository";
import {Types} from "../../Types";
import {TranslatedTask} from "../Models/Tasks/TranslatedTask";
import {TranslationEmailRequest} from "../../Entities/TranslationEmailRequest";
import fetch from "node-fetch";
import {IConfiguration} from "../../Common/Configuration";

export interface IEmailServiceApiCaller {

    callEmailService(jobId: string): Promise<void>;
}

@injectable()
class EmailServiceApiCaller implements IEmailServiceApiCaller {

    private readonly configuration: IConfiguration;
    private readonly emailServiceApiUrl: string;
    private readonly translationTaskRepository: ITranslationTaskRepository;

    constructor(
        @inject(Types.ITranslationTaskRepository) translationTaskRepository: ITranslationTaskRepository,
        @inject(Types.IConfiguration) configuration: IConfiguration) {

        this.configuration = configuration;
        this.emailServiceApiUrl = this.configuration.getConfig('EmailServiceApiUrl');
        this.translationTaskRepository = translationTaskRepository;
    }

    async callEmailService(jobId: string): Promise<void> {

        let allTasks: Array<TranslatedTask> = await this.translationTaskRepository.getAllTask(jobId);
        if (allTasks.length > 0) {
            let emailRequest = new TranslationEmailRequest(
                jobId,
                allTasks[0].translationRequest.email,
                allTasks
            );

            try {
                let response = await fetch(this.emailServiceApiUrl, {
                    method: 'post',
                    body: JSON.stringify(emailRequest),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                return await response.json();
            } catch (e) {

                console.error("Send " + jobId + " to Email service Api failed: " + e.message);
            }
        }

        return Promise.resolve(undefined);
    }
}

export {EmailServiceApiCaller}