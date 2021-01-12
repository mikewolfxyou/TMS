import {TranslationRequest} from "./TranslationRequest";

class TranslationJob {
    jobId: string;
    translationRequest: TranslationRequest;


    constructor(jobId: string, translationRequest: TranslationRequest) {
        this.jobId = jobId;
        this.translationRequest = translationRequest;
    }
}

export {TranslationJob}