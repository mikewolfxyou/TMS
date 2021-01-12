import {Container} from "inversify";
import {Types} from "./Types";
import {IConfiguration} from "./Common/Configuration";
import {IDataAccess} from "./Common/DataAccess";
import {Configuration} from "./Common/Configuration";
import {DataAccess} from "./Common/DataAccess";
import {ISegmentDao, SegmentDao} from "./TranslationManagementSystem/DataAccess/SegmentDao";
import {ISegmentRepository, SegmentRepository} from "./TranslationManagementSystem/Repositories/SegmentRepository";
import {ITmsApiCaller, TmsApiCaller} from "./TranslationSubmitter/Services/TmsApiCaller";
import {ITranslationTaskDao, TranslationTaskDao} from "./TranslationManagementSystem/DataAccess/TranslationTaskDao";
import {ITranslationService, TranslationService} from "./TranslationManagementSystem/Services/TranslationSevice";
import {FileLoader, IFileLoader} from "./TranslationManagementSystem/Infrastructure/FileLoader";
import {ITranslatingTaskCreator, TranslatingTaskCreator} from "./TranslationManagementSystem/Services/TranslatingTaskCreator";
import {ITranslateSegmentService, TranslateSegmentService} from "./TranslationManagementSystem/Services/TranslateSegmentService";
import {ITranslatedTaskHandler, TranslatedTaskHandler} from "./TranslationManagementSystem/Services/TranslatedTaskHandler";
import {ITranslationFuzzyMatch, TranslationFuzzyMatch} from "./TranslationManagementSystem/Services/TranslationFuzzyMatch";
import {ITranslationTaskRepository, TranslationTaskRepository} from "./TranslationManagementSystem/Repositories/TranslationTaskRepository";
import {ICleanTextProcessor, SubtitleCleanTextProcessor} from "./TranslationManagementSystem/Services/CleanTextProcessor";
import {FileWriter, IFileWriter} from "./TranslationManagementSystem/Infrastructure/FileWriter";
import {EmailServiceApiCaller, IEmailServiceApiCaller} from "./TranslationManagementSystem/Services/EmailServiceApiCaller";
import {EmailServiceRepository, IEmailServiceRepository} from "./TranslationEmailService/Repository/EmailServiceRepository";
import {EmailServiceDao, IEmailServiceDao} from "./TranslationEmailService/DataAccess/EmailServiceDao";
import {IMailSender, MailSender} from "./TranslationEmailService/Infrastructure/MailSender";

const appDIContainer = new Container();

appDIContainer.bind<IConfiguration>(Types.IConfiguration).to(Configuration);
appDIContainer.bind<IDataAccess>(Types.IDataAccess).to(DataAccess).inSingletonScope();
appDIContainer.bind<ISegmentDao>(Types.ISegmentDao).to(SegmentDao).inSingletonScope();
appDIContainer.bind<ISegmentRepository>(Types.ISegmentRepository).to(SegmentRepository);
appDIContainer.bind<ITmsApiCaller>(Types.ITmsApiCaller).to(TmsApiCaller);
appDIContainer.bind<ITranslationTaskRepository>(Types.ITranslationTaskRepository).to(TranslationTaskRepository)
appDIContainer.bind<ITranslationTaskDao>(Types.ITranslationTaskDao).to(TranslationTaskDao).inSingletonScope();
appDIContainer.bind<ITranslationService>(Types.ITranslationService).to(TranslationService);
appDIContainer.bind<ITranslatingTaskCreator>(Types.ITranslatingTaskCreator).to(TranslatingTaskCreator);
appDIContainer.bind<IFileLoader>(Types.IFileLoader).to(FileLoader);
appDIContainer.bind<ITranslateSegmentService>(Types.ITranslateSegmentService).to(TranslateSegmentService);
appDIContainer.bind<ITranslatedTaskHandler>(Types.ITranslationFileMergeService).to(TranslatedTaskHandler);
appDIContainer.bind<ITranslationFuzzyMatch>(Types.ITranslationFuzzyMatch).to(TranslationFuzzyMatch);
appDIContainer.bind<ICleanTextProcessor>(Types.ICleanTextProcessor).to(SubtitleCleanTextProcessor);
appDIContainer.bind<IFileWriter>(Types.IFileWriter).to(FileWriter);
appDIContainer.bind<IEmailServiceApiCaller>(Types.IEmailServiceApiCaller).to(EmailServiceApiCaller);
appDIContainer.bind<IEmailServiceRepository>(Types.IEmailServiceRepository).to(EmailServiceRepository);
appDIContainer.bind<IEmailServiceDao>(Types.IEmailServiceDao).to(EmailServiceDao);
appDIContainer.bind<IMailSender>(Types.IMailSender).to(MailSender);

export {appDIContainer};