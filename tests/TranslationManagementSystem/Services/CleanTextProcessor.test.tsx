import {SubtitleCleanTextProcessor} from "../../../src/TranslationManagementSystem/Services/CleanTextProcessor";

describe('SubtitleCleanTextProcessor Tests', function () {

    it('Should both empty, when given empty', () => {

        let processor = new  SubtitleCleanTextProcessor();
        let actualResult: [string, string] = processor.getCleanedText("")
        expect(actualResult[0]).toBe("");
        expect(actualResult[1]).toBe("");
    });

    it('Should both empty, when given first word is not line number', () => {

        let processor = new  SubtitleCleanTextProcessor();
        let actualResult: [string, string] = processor.getCleanedText("a ba")
        expect(actualResult[0]).toBe("");
        expect(actualResult[1]).toBe("");
    });

    it('Should both empty, when no time range', () => {

        let processor = new  SubtitleCleanTextProcessor();
        let actualResult: [string, string] = processor.getCleanedText("1 asdfadsf")
        expect(actualResult[0]).toBe("");
        expect(actualResult[1]).toBe("");
    });

    it('Should both empty, when given time range is not complete', () => {

        let processor = new  SubtitleCleanTextProcessor();
        let actualResult: [string, string] = processor.getCleanedText("1 [")
        expect(actualResult[0]).toBe("");
        expect(actualResult[1]).toBe("");
    });

    it('Should both empty, when given time range format is wrong', () => {

        let processor = new  SubtitleCleanTextProcessor();
        let actualResult: [string, string] = processor.getCleanedText("1 ]")
        expect(actualResult[0]).toBe("");
        expect(actualResult[1]).toBe("");
    });

    it('Should both empty, when given no space between line number and time', () => {

        let processor = new  SubtitleCleanTextProcessor();
        let actualResult: [string, string] = processor.getCleanedText("1[afasdf]")
        expect(actualResult[0]).toBe("");
        expect(actualResult[1]).toBe("");
    });

    it('Should both empty, when given time range is empty', () => {

        let processor = new  SubtitleCleanTextProcessor();
        let actualResult: [string, string] = processor.getCleanedText("1 []")
        expect(actualResult[0]).toBe("");
        expect(actualResult[1]).toBe("");
    });

    it('Should both emptye, when given time range is wrong', () => {

        let processor = new  SubtitleCleanTextProcessor();
        let actualResult: [string, string] = processor.getCleanedText("1 [adfldfa] a")
        expect(actualResult[0]).toBe("");
        expect(actualResult[1]).toBe("");
    });

    it('Should both emptye, when given line number is not number', () => {

        let processor = new  SubtitleCleanTextProcessor();
        let actualResult: [string, string] = processor.getCleanedText("1a0 [00:00:12.00 - 00:01:20.00] a")
        expect(actualResult[0]).toBe("");
        expect(actualResult[1]).toBe("");
    });

    it('Should give time range and rest chars after time range, when given time range is complete, line number is more than 2 bits', () => {

        let processor = new  SubtitleCleanTextProcessor();
        let actualResult: [string, string] = processor.getCleanedText("10 [00:00:12.00 - 00:01:20.00] a")
        expect(actualResult[0]).toBe("10 [00:00:12.00 - 00:01:20.00] ");
        expect(actualResult[1]).toBe("a");
    });
});