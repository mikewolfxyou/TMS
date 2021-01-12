const Types = {
    IDataAccess: Symbol.for("IDataAccess"),
    IConfiguration: Symbol.for("IConfiguration"),
    ISegmentDao: Symbol.for("ISegmentDao"),
    ITmsApiCaller: Symbol.for("ITmsApiCaller"),
    ISegmentRepository: Symbol.for("ISegmentRepository"),
    ITranslationTaskRepository: Symbol.for("ITranslationTaskRepository"),
    ITranslationTaskDao: Symbol.for("ITranslationTaskDao"),
    ITranslationService: Symbol.for("ITranslationService"),
    IFileLoader: Symbol.for("IFileLoader"),
    ITranslatingTaskCreator: Symbol.for("ITranslatingTaskCreator"),
    ITranslateSegmentService: Symbol.for("ITranslateSegmentService"),
    ITranslationFileMergeService: Symbol.for("ITranslationFileMergeService"),
    ITranslationFuzzyMatch: Symbol.for("ITranslationFuzzyMatch"),
    ICleanTextProcessor: Symbol.for("ICleanTextProcessor"),
    IFileWriter: Symbol.for("IFileWriter"),
    IEmailServiceApiCaller: Symbol.for("IEmailServiceApiCaller"),
    IEmailServiceDao: Symbol.for("IEmailServiceDao"),
    IEmailServiceRepository: Symbol.for("IEmailServiceRepository"),
    IMailSender: Symbol.for("IMailSender"),
};

export {Types};