import {injectable} from "inversify";
import "reflect-metadata";
import LineByLineReader from 'line-by-line';

export interface IFileLoader{
    getLineReader(fileName: string): LineByLineReader;
}

@injectable()
class FileLoader implements IFileLoader {
    constructor() {
    }

    getLineReader(fileName: string): LineByLineReader {
        return new LineByLineReader(fileName);
    }
}

export {FileLoader};
