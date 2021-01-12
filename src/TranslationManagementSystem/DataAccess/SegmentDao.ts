import {SegmentDto} from "./SegmentDto";
import {IDataAccess} from "../../Common/DataAccess";
import Languages from "../Models/Languages";
import {inject, injectable} from "inversify";
import {Types} from "../../Types";
import "reflect-metadata";

export interface ISegmentDao {

    save(segment: SegmentDto): Promise<void>;
}

@injectable()
class SegmentDao implements ISegmentDao {

    private readonly dataAccess: IDataAccess;


    constructor(@inject(Types.IDataAccess) dataAccess: IDataAccess) {

        this.dataAccess = dataAccess;
    }

    async save(segment: SegmentDto): Promise<void> {

        const insert = "INSERT INTO tinytm_segments (segment_id, segment_key, parent_id, owner_id, creation_date, creation_ip, customer_id, segment_type_id, text_type, document_key, source_lang_id, target_lang_id, tags, source_text, target_text, subject_area_id) " +
            "SELECT nextval('tinytm_segments_seq'), NULL, NULL, tinytm_current_user_id(), to_timestamp($5), '0.0.0.0', NULL, tinytm_segment_type_id_from_string('Segment'), 'text/plain', NULL, tinytm_language_id_from_string($6), tinytm_language_id_from_string($7), NULL, $8, $9, NULL ";
        const upsert = "UPDATE tinytm_segments SET target_text = $1 WHERE source_lang_id = $2 AND target_lang_id = $3 AND source_text = $4";
        const upsertQuery = "WITH upsert AS (" + upsert + " RETURNING *) " + insert + " WHERE NOT EXISTS (SELECT * FROM upsert)";

        let values = new Array<string>();
        values.push(segment.targetText.toString()) //$1 target_text
        values.push(segment.source.toString()) //$2 source_lang_id
        values.push(segment.target.toString()) //$3 target_lang_id
        values.push(segment.sourceText.toString()) //$4 source_text

        values.push((Date.now() / 1000.0).toString()); //$5 creation_date
        values.push(Languages[segment.source].toString()) //$6 source_lang_id
        values.push(Languages[segment.target].toString()) //$7 target_lang_id
        values.push(segment.sourceText.toString()) //$8 source_text
        values.push(segment.targetText.toString()) //$9 target_text

        let client = await this.dataAccess.getConnection();
        try {

            await client.query('BEGIN')
            await client.query('LOCK TABLE tinytm_segments IN SHARE ROW EXCLUSIVE MODE;')
            await client.query(upsertQuery, values);
            await client.query('COMMIT')

        } catch (e) {
            await client.query('ROLLBACK')
            console.error(e.message);
        } finally {
            client.release();
        }

        return Promise.resolve(undefined);
    }
}

export {SegmentDao};