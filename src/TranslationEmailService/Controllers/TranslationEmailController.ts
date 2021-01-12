import * as express from "express";
import {TranslationEmailRequest} from "../../Entities/TranslationEmailRequest";
import {IEmailServiceRepository} from "../Repository/EmailServiceRepository";
import {inject} from "inversify";
import {Types} from "../../Types";
import {IMailSender} from "../Infrastructure/MailSender";

class TranslationEmailController {

    public requestPath = '/send-email';
    public router = express.Router();

    private readonly emailServiceRepository: IEmailServiceRepository;
    private readonly mailSender: IMailSender;

    constructor(@inject(Types.IEmailServiceRepository) emailServiceRepository: IEmailServiceRepository,
                @inject(Types.IMailSender) mailSender: IMailSender
    ) {
        this.mailSender = mailSender;
        this.emailServiceRepository = emailServiceRepository;
        this.initializeRoutes();
    }

    public initializeRoutes() {

        this.router.post(this.requestPath, this.sendEmail);
    }

    sendEmail = async (request: express.Request, response: express.Response) => {
        let emailRequest: TranslationEmailRequest = request.body;
        let savedJobId = await this.emailServiceRepository.save(emailRequest.jobId, emailRequest.email);
        //There could be race condition when multiple files in one upload action which has same job id, because parallel
        //translation processes, I send email only once, which the first time the jobId (uuid) insert into db
        if (savedJobId == emailRequest.jobId) {

            await this.mailSender.sendEmail(emailRequest);

            response.send("{\"status\": \"Job saved, email send\"}");
        } else {

            console.log("Job has been saved and send, not need do it again");
        }
    }
}

export {TranslationEmailController}