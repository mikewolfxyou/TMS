import {WriteStream} from "fs";
import {injectable} from "inversify";
import * as fs from "fs";

export interface IFileWriter {
    getWriteStream(filePath: string, fileName: string): WriteStream;
}

@injectable()
class FileWriter implements IFileWriter {
    getWriteStream(filePath: string, fileName: string, ): WriteStream {

        return fs.createWriteStream(filePath + fileName);
    }
}

export {FileWriter}