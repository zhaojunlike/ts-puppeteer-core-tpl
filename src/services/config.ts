const fs = require('fs');
const path = require('path');
const ROOT_PATH = process.cwd();
const CONFIG_PATH = path.join(ROOT_PATH, 'config/');
const TEMP_PATH = path.join(ROOT_PATH, 'temp/');
const filename = path.join(CONFIG_PATH, 'config.txt');
const consola = require('consola');

export interface ConfigInfo {
    ticketId: number,
    dateId: number,
    type: number,
    tickets: any[],
    site: boolean,
    xing: string,
    ming: string,
    email: string,
    cash: {
        //领取方法
        method: number
    },
    card: {
        type: number,
        no: string,
        code: string,
        date: string,
    }
}

export class ConfigService {
    //临时文件夹
    public static temp: string = TEMP_PATH;
    public static filename: string = filename;
    public static debug = false;

    public static async getFileContent(filename: string): Promise<string> {
        console.log(`读取配置文件:${filename}`);
        if (fs.existsSync(filename)) {
            return fs.readFileSync(filename).toString();
        } else {
            return "";
        }
    }

    public static parseTaskConfig(content: string): ConfigInfo[] {
        let cfgs: ConfigInfo[] = [];
        content.split(/\n/).forEach((line, row) => {
            if (line === '' || /^\#/.test(line)) return false;
            const arr = line.replace(/\r|\t|\n/g, '').split(',');
            if (arr.length !== 13) {
                consola.info(`${row + 1}行配置信息错误`);
                return false;
            }
            let ticketId = parseInt(arr[0]);
            let dateId = parseInt(arr[1]);
            let type = parseInt(arr[2]);
            let tickets = [];
            arr[3].replace(/\[|\]/g, '').split(/\|/).forEach((str) => {
                const arr = str.toString().split(/\=/);
                if (arr.length !== 2) {
                    consola.error(`解析票项配置失败:Line=${row}`)
                    return false;
                }
                tickets.push({key: parseInt(arr[0]), count: arr[1]});
            });
            let site = parseInt(arr[4]) === 1;
            let xing = (arr[5]);
            let ming = (arr[6]);
            let email = (arr[7]);
            let cash = {
                method: parseInt(arr[8])
            };
            let card = {
                type: parseInt(arr[9]),
                no: (arr[10]),
                code: (arr[11]),
                date: (arr[12]),
            };
            const info: ConfigInfo = {
                ticketId: ticketId, dateId: dateId, type: type, tickets: tickets,
                site: site, xing: xing, ming: ming, email: email, cash: cash, card: card
            };
            cfgs.push(info);
        });
        return cfgs;
    }
}
