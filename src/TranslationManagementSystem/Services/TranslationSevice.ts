import {inject, injectable} from "inversify";
import "reflect-metadata";
import {TranslationTask} from "../Models/Tasks/TranslationTask";
import {ITranslatingTaskCreator} from "./TranslatingTaskCreator";
import {Types} from "../../Types";
import {ITranslateSegmentService} from "./TranslateSegmentService";
import {ITranslatedTaskHandler} from "./TranslatedTaskHandler";

export interface ITranslationService {
    translate(translationTask: TranslationTask): Promise<boolean>;
}

@injectable()
class TranslationService implements ITranslationService {

    private readonly translatingTaskCreator: ITranslatingTaskCreator;
    private readonly translationSegmentService: ITranslateSegmentService;
    private readonly translatedTaskHandler: ITranslatedTaskHandler;

    constructor(
        @inject(Types.ITranslatingTaskCreator)translatingTaskCreator: ITranslatingTaskCreator,
        @inject(Types.ITranslateSegmentService)translationSegmentService: ITranslateSegmentService,
        @inject(Types.ITranslationFileMergeService)translatedTaskHandler: ITranslatedTaskHandler ) {

        this.translatingTaskCreator = translatingTaskCreator;
        this.translationSegmentService = translationSegmentService;
        this.translatedTaskHandler = translatedTaskHandler;
    }

    async translate(translationTask: TranslationTask): Promise<boolean> {

        let translatingTask = await this.translatingTaskCreator.create(translationTask);
        let translatedTask = await this.translationSegmentService.translateSegment(translatingTask);
        let translationJobResult = await this.translatedTaskHandler.handleTranslatedTask(translatedTask);

        return Promise.resolve(translationJobResult);
    }
}

export {TranslationService}