import * as express from 'express';
import multer from 'multer';
import {ITmsApiCaller} from "../Services/TmsApiCaller";
import _ from 'lodash';
import {inject} from "inversify";
import {Types} from "../../Types";
import "reflect-metadata";
import {v4 as uuid} from 'uuid';
import {TranslationJob} from "../../Entities/TranslationJob";
import {TranslationRequest} from "../../Entities/TranslationRequest";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        const uploadsPath = path.join(__dirname, "../../../uploads")
        //TODO destination path should get from configuration + username, make it dynamic
        cb(null, uploadsPath);
    },

    filename: function (req: any, file: any, cb: any) {

        //TODO create folder base on date time
        cb(null, file.originalname);
    }
});

const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype === "text/plain") {
        cb(null, true);
    } else {
        console.log("wrong file type");
        cb(new Error("Translation file uploaded is not of type text/plain"), false);
    }
}

//TODO should put into another service
const upload = multer({storage: storage, fileFilter: fileFilter});

class TranslationSubmitterController {

    public path = '/translation-requests';
    public router = express.Router();
    private tmsApiCaller: ITmsApiCaller;

    constructor(@inject(Types.ITmsApiCaller) tmsApiCaller: ITmsApiCaller) {
        this.tmsApiCaller = tmsApiCaller;
        this.initializeRoutes();
    }

    public initializeRoutes() {

        //TODO max receive file numbers should be get from configuration
        //TODO handle the exception of saving files
        this.router.post(this.path, upload.array('files', 5), this.acceptTranslationRequest);
    }

    acceptTranslationRequest = async (request: express.Request, response: express.Response) => {

        let tmpApiResponses = new Array<Promise<string>>();
        let jobId = uuid();
        //TODO Validating incoming data, should create a validator
        _(request.files).forEach((item: any) => {
            tmpApiResponses.push(this.tmsApiCaller.callTmsApi(
                new TranslationJob(
                    jobId,
                    new TranslationRequest(
                        request.body.email,
                        request.body.source,
                        request.body.target,
                        item.originalname,
                        item.path
                    )
                )
                )
            );
        });

        let responses = new Array<Object>();
        await Promise.allSettled(tmpApiResponses)
            .then((results) => results.forEach(
                (result) => {
                    responses.push(result);
                }
            ));

        //TODO should send HTTP status code
        response.send(JSON.stringify(responses));
    }
}

export {TranslationSubmitterController};