import * as express from "express";
import {ISegmentRepository} from "../Repositories/SegmentRepository";
import _ from "lodash";
import {SegmentRequest} from "../DataAccess/SegmentRequest";
import {SegmentDto} from "../DataAccess/SegmentDto";
import Languages from "../Models/Languages";
import {inject} from "inversify";
import {Types} from "../../Types";
import {TranslationJob} from "../../Entities/TranslationJob";
import {TranslationTask} from "../Models/Tasks/TranslationTask";
import {ITranslationService} from "../Services/TranslationSevice";
import {ITranslationTaskRepository} from "../Repositories/TranslationTaskRepository";
import {IEmailServiceApiCaller} from "../Services/EmailServiceApiCaller";

class TranslationSystemController {

    public requestPath = '/document-translation';
    public dataFeedPath = '/data-feed';
    public router = express.Router();
    private readonly segmentRepository: ISegmentRepository;
    private readonly translationTaskRepository: ITranslationTaskRepository;
    private readonly translationService: ITranslationService;
    private readonly emailServiceApiCaller: IEmailServiceApiCaller;

    constructor(@inject(Types.ISegmentRepository) segmentRepository: ISegmentRepository,
                @inject(Types.ITranslationTaskRepository) tmsTranslationRequestRepository: ITranslationTaskRepository,
                @inject(Types.ITranslationService) translationService: ITranslationService,
                @inject(Types.IEmailServiceApiCaller) emailServiceApiCaller: IEmailServiceApiCaller
    ) {
        this.initializeRoutes();
        this.segmentRepository = segmentRepository;
        this.translationTaskRepository = tmsTranslationRequestRepository;
        this.translationService = translationService;
        this.emailServiceApiCaller = emailServiceApiCaller;
    }

    public initializeRoutes() {

        this.router.post(this.requestPath, this.documentTranslation);
        this.router.post(this.dataFeedPath, this.dataFeed);
    }

    documentTranslation = async (request: express.Request, response: express.Response) => {
        let translationJob: TranslationJob = request.body;
        let taskId = await this.translationTaskRepository.save(translationJob);

        //Fire and forgot, the request job will be notified via Email when whole job done
        this.translationService.translate(
            new TranslationTask(taskId, translationJob.jobId, translationJob.translationRequest)
        ).then(async (result) => {
            if (result) {
                let isAllJobDone = await this.translationTaskRepository.isAllJobDone(translationJob.jobId);
                if (isAllJobDone) {
                    await this.emailServiceApiCaller.callEmailService(translationJob.jobId);
                }
            }
        });

        //TODO send HTTP code 202
        response.send(JSON.stringify(translationJob));
    };

    dataFeed = async (request: express.Request, response: express.Response) => {

        let segmentDtos = new Array<SegmentDto>();
        _(request.body).forEach((item: SegmentRequest) => {
            segmentDtos.push(new SegmentDto(
                Languages[item.sourceLanguage as keyof typeof Languages],
                Languages[item.targetLanguage as keyof typeof Languages],
                item.source,
                item.target
            ))
        });

        try {
            await this.segmentRepository.save(segmentDtos);
        } catch (e) {
            console.error(e.message);
            //TODO send HTTP code 500
            response.send("{\"status\": \"data feed not saved\"}")
        }

        //TODO send HTTP code 202
        response.send("{\"status\": \"data feed saved\"}")
    };
}

export {TranslationSystemController};