import Languages from "../Models/Languages";

class SegmentDto {
    source: Languages;
    target: Languages;
    sourceText: string;
    targetText: string;


    constructor(source: Languages, target: Languages, sourceText: string, targetText: string) {

        this.source = source;
        this.target = target;
        this.sourceText = sourceText;
        this.targetText = targetText;
    }
}

export {SegmentDto}