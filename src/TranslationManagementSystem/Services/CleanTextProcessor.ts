import {injectable} from "inversify";
import "reflect-metadata";

export interface ICleanTextProcessor {

    getCleanedText(text: string): [string, string];
}

@injectable()
class SubtitleCleanTextProcessor implements ICleanTextProcessor {

    getCleanedText(text: string): [string, string] {
        let timeRange: RegExpMatchArray | null = text.match(/^\d+\ \[\d{2}:\d{2}:\d+.\d+\ -\ \d{2}:\d{2}:\d+.\d+\]\ /g);
        if (timeRange != null) {
            return [timeRange[0], text.substr(timeRange[0].length, text.length)]
        }
        return ["", ""];
    }
}

export {SubtitleCleanTextProcessor}