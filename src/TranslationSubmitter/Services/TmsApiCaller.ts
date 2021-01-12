import {IConfiguration} from "../../Common/Configuration";
import fetch from "node-fetch";
import {inject, injectable} from "inversify";
import "reflect-metadata";
import {Types} from "../../Types";
import {TranslationJob} from "../../Entities/TranslationJob";

export interface ITmsApiCaller {

    callTmsApi(translationJob: TranslationJob): Promise<string>;
}

@injectable()
class TmsApiCaller implements ITmsApiCaller {

    private readonly configuration: IConfiguration;
    private readonly tmsApiUrl: string;

    constructor(@inject(Types.IConfiguration) configuration: IConfiguration) {

        this.configuration = configuration
        this.tmsApiUrl = this.configuration.getConfig('TmsApiUrl');
    }

    async callTmsApi(translationJob: TranslationJob): Promise<string> {
        try {
            let response = await fetch(this.tmsApiUrl, {
                method: 'post',
                body: JSON.stringify(translationJob),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            return await response.json();
        } catch (e) {

            console.error(e);
            return "Send " + translationJob.translationRequest.originalFileName + " to TMS Api failed";
        }
    }
}

export {TmsApiCaller};