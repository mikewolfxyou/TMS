import {appDIContainer} from "./Inversify.config";
import {Types} from "./Types";

import {App} from './TranslationSubmitter/App';
import {TranslationSubmitterController} from "./TranslationSubmitter/Controllers/TranslationSubmitterController";
import {ITmsApiCaller} from "./TranslationSubmitter/Services/TmsApiCaller";

import {TmsApp} from './TranslationManagementSystem/App';
import {TranslationSystemController} from './TranslationManagementSystem/Controllers/TranslationSystemController';
import {ISegmentRepository} from './TranslationManagementSystem/Repositories/SegmentRepository';
import {ITranslationService} from "./TranslationManagementSystem/Services/TranslationSevice";
import {ITranslationTaskRepository} from "./TranslationManagementSystem/Repositories/TranslationTaskRepository";
import {EmailApp} from "./TranslationEmailService/App";
import {TranslationEmailController} from "./TranslationEmailService/Controllers/TranslationEmailController";
import {IEmailServiceApiCaller} from "./TranslationManagementSystem/Services/EmailServiceApiCaller";
import {IEmailServiceRepository} from "./TranslationEmailService/Repository/EmailServiceRepository";
import {IMailSender} from "./TranslationEmailService/Infrastructure/MailSender";

const port = process.env.PORT || 3000;

const app = new App([
    new TranslationSubmitterController(appDIContainer.get<ITmsApiCaller>(Types.ITmsApiCaller))],
    Number(port));
app.listen();

const tmsPort = process.env.PORT || 3001;

//TODO This application normally should be in a separated project and repository
const tmsApp = new TmsApp([
    new TranslationSystemController(
        appDIContainer.get<ISegmentRepository>(Types.ISegmentRepository),
        appDIContainer.get<ITranslationTaskRepository>(Types.ITranslationTaskRepository),
        appDIContainer.get<ITranslationService>(Types.ITranslationService),
        appDIContainer.get<IEmailServiceApiCaller>(Types.IEmailServiceApiCaller)
    )],
    Number(tmsPort)
);
tmsApp.listen();

//TODO This application normally should be in a separated project and repository
const emailServicePort = process.env.PORT || 3002;
const emailApp = new EmailApp([new TranslationEmailController(
    appDIContainer.get<IEmailServiceRepository>(Types.IEmailServiceRepository),
    appDIContainer.get<IMailSender>(Types.IMailSender)
)],
    Number(emailServicePort));

emailApp.listen();