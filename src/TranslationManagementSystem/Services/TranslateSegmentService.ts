import {inject, injectable} from "inversify";
import "reflect-metadata";
import {TranslatingTask} from "../Models/Tasks/TranslatingTask";
import {TranslatedTask} from "../Models/Tasks/TranslatedTask";
import {ITranslationFuzzyMatch} from "./TranslationFuzzyMatch";
import {IFileLoader} from "../Infrastructure/FileLoader";
import {Types} from "../../Types";
import {FailedTranslatedTask} from "../Models/Tasks/FailedTranslatedTask";
import {ITask} from "../Models/Tasks/ITask";
import Languages from "../Models/Languages";
import {ICleanTextProcessor} from "./CleanTextProcessor";
import {IFileWriter} from "../Infrastructure/FileWriter";

export interface ITranslateSegmentService {

    translateSegment(translatingTask: ITask): Promise<ITask>
}

@injectable()
class TranslateSegmentService implements ITranslateSegmentService {

    private readonly fileLoader: IFileLoader;
    private readonly fileWriter: IFileWriter;
    private readonly fuzzyMatch: ITranslationFuzzyMatch;
    private readonly textProcessor: ICleanTextProcessor;

    constructor(@inject(Types.IFileLoader)fileReader: IFileLoader,
                @inject(Types.IFileWriter)fileWriter: IFileWriter,
                @inject(Types.ITranslationFuzzyMatch)fuzzyMatch: ITranslationFuzzyMatch,
                @inject(Types.ICleanTextProcessor) cleanTextProcessor: ICleanTextProcessor
    ) {
        this.fileLoader = fileReader;
        this.fileWriter = fileWriter;
        this.fuzzyMatch = fuzzyMatch;
        this.textProcessor = cleanTextProcessor;
    }

    async translateSegment(translatingTask: ITask): Promise<ITask> {

        //TODO Should use configuration path
        const translatedFilePath = 'translated/';

        let task = translatingTask as TranslatingTask;
        let translatedFileName = task.translationRequest.target + '_' + task.translationRequest.originalFileName;

        let lineReader = this.fileLoader.getLineReader(task.translationRequest.originalFilePath);
        let translatedFileWriter = this.fileWriter.getWriteStream(translatedFilePath,  translatedFileName);

        let fuzzyMatch = this.fuzzyMatch;
        let textProcessor = this.textProcessor;

        //TODO find a way to mock lineReader's on function then could do the unit test
        lineReader.on('error', function (error) {
            console.error(`TranslatedTask - ${task.taskId} - failed`);
            return Promise.resolve(new FailedTranslatedTask(task.taskId, error.message));
        })

        lineReader.on('line', async function (line) {

            lineReader.pause();
            console.debug("Read line from source file: " + line);
            let cleanedText: [string, string] = textProcessor.getCleanedText(line);

            if (cleanedText[0] != "" && cleanedText[1] != "") {
                let translatedLine = await fuzzyMatch.getFuzzyMatch(
                    Languages[task.translationRequest.source as keyof typeof Languages],
                    Languages[task.translationRequest.target as keyof typeof Languages],
                    cleanedText[1]
                );

                if (translatedLine != "") {
                    console.debug("Translated: " + cleanedText[0] + translatedLine);
                    translatedFileWriter.write(cleanedText[0] + translatedLine + "\n");
                } else {
                    console.debug("NO Translated: " + line);
                    translatedFileWriter.write(line + "\n");
                }
            } else {
                console.debug("NO Translated: " + line);
                translatedFileWriter.write(line + "\n");
            }

            lineReader.resume();
        })

        lineReader.on('end', function () {
            console.info(`Translation task - ${task.taskId.toString()} - done`);
        })

        return Promise.resolve(new TranslatedTask(
            task.taskId,
            task.translationRequest,
            translatedFileName,
            translatedFilePath + translatedFileName
        ));
    }
}

export {TranslateSegmentService};