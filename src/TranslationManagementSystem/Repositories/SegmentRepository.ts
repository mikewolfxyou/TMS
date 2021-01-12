import {SegmentDto} from "../DataAccess/SegmentDto";
import _ from "lodash";
import {inject, injectable} from "inversify";
import "reflect-metadata";
import {Types} from "../../Types";
import {ISegmentDao} from "../DataAccess/SegmentDao";

export interface ISegmentRepository {

    /**
     * @param segments
     */
    save(segments: Array<SegmentDto>) : Promise<void>;
}

@injectable()
class SegmentRepository implements ISegmentRepository{

    private readonly segmentDao: ISegmentDao ;

    /**
     * @param segmentDao
     */
    constructor(@inject(Types.ISegmentDao) segmentDao: ISegmentDao) {

        this.segmentDao = segmentDao;
    }

    /**
     * @param segments
     *
     * @return void
     */
    async save(segments: Array<SegmentDto>): Promise<void> {

        let daoTasks = new Array<Promise<void>>();

        _(segments).forEach((segment: any) => {
            daoTasks.push(this.segmentDao.save(segment));
        });

        await Promise.all(
            daoTasks.map(promise => promise.catch(error => {
                console.error(error.message)
            }))
        );
    }
}

export {SegmentRepository};
