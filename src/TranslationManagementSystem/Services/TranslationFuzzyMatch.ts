import Languages from "../Models/Languages";
import {inject, injectable} from "inversify";
import {IDataAccess} from "../../Common/DataAccess";
import {Types} from "../../Types";
import "reflect-metadata";

export interface ITranslationFuzzyMatch {
    getFuzzyMatch(source: Languages, target: Languages, sourceText: string): Promise<string>;
}

@injectable()
class TranslationFuzzyMatch implements ITranslationFuzzyMatch {

    private readonly dataAccess: IDataAccess;

    constructor(@inject(Types.IDataAccess)dataAccess: IDataAccess) {
        this.dataAccess = dataAccess;
    }

    async getFuzzyMatch(source: Languages, target: Languages, sourceText: string): Promise<string> {

        const fuzzyMatchQuery = "SELECT target_text FROM tinytm_get_fuzzy_matches($1, $2, $3,'', '') LIMIT 1"
        let values = [Languages[source], Languages[target], sourceText];

        let client = await this.dataAccess.getConnection();
        try {
            let result = await client.query(fuzzyMatchQuery, values);
            if (result.rows.length > 0 && result.rows[0]['target_text'] != null) {

                return Promise.resolve(result.rows[0]['target_text']);
            }
        } catch (e) {
            console.error(e.message);
        } finally {
            client.release();
        }
        return Promise.resolve("");
    }
}

export {TranslationFuzzyMatch}