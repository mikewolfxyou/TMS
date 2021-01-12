class SegmentRequest {

    source: string;
    target: string;
    sourceLanguage: string;
    targetLanguage: string;


    constructor(source: string, target: string, sourceLanguage: string, targetLanguage: string) {
        this.source = source;
        this.target = target;
        this.sourceLanguage = sourceLanguage;
        this.targetLanguage = targetLanguage;
    }
}

export {SegmentRequest};