class TranslationRequest {

    email: string;
    source: string;
    target: string;
    originalFileName: string;
    originalFilePath: string;


    constructor(email: string, source: string, target: string, originalFileName: string, submittedPath: string) {

        this.email = email;
        this.source = source;
        this.target = target;
        this.originalFileName = originalFileName;
        this.originalFilePath = submittedPath;
    }
}

export {TranslationRequest}