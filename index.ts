import { register } from "module";
import { IData } from "./i-data";
var fs = require("fs");
const xlsx = require('xlsx');

const groupeByYear = async (data: IData[]) => {
    let yearList: string[] = [];
    let group: IData[][] = [];

    for await (const register of data) {
        if (!yearList.includes(register.year)) {
            yearList.push(register.year);
        }
    }

    for await (const year of yearList) {
        let tmpData: IData[] = [];
        for (const register of data) {
            if (register.year === year) {
                tmpData.push(register);
            }
        }
        group.push(tmpData);
    }

    return group;
};

const groupeByMonth = async (data: IData[]) => {
    let monthList: string[] = [];
    let group: IData[][] = [];

    for await (const register of data) {
        if (!monthList.includes(register.month)) {
            monthList.push(register.month);
        }
    }

    for await (const month of monthList) {
        let tmpData: IData[] = [];
        for await (const register of data) {
            if (month === register.month) {
                tmpData.push(register);
            }
        }
        group.push(tmpData);
    }

    return group;
};

const switchMonth = async (date: string) => {

    switch (date) {
        case '1':
            return 'janeiro';
            break;
        case '2':
            return 'fevereiro';
            break;
        case '3':
            return 'março';
            break;
        case '4':
            return 'abril';
            break;
        case '5':
            return 'maio';
            break;
        case '6':
            return 'junho';
            break;
        case '7':
            return 'julho';
            break;
        case '8':
            return 'agosto';
            break;
        case '9':
            return 'setembro';
            break;
        case '10':
            return 'outubro';
            break;
        case '11':
            return 'novembro';
            break;
        case '12':
            return 'dezembro';
            break;

        default:
            return 'switchDate() error';
            break;
    }
};

const jsonFormat = async (data: IData[][]) => {

    let result: object[] = [];

    for (const month of data) {
        let register: any = {};
        register["data"] = await switchMonth(month[0].month) + '/' + month[0].year;
        for await (const day of month) {
            register[day.day] = day.q;
        }

        result.push(register);
    }

    //console.log(result);

    return result;
};

const convertToXlsx = async (jsonData: object[], outputFilePath: string) => {
    const workbook = await xlsx.utils.book_new();
    const sheet = await xlsx.utils.json_to_sheet(jsonData);
    await xlsx.utils.book_append_sheet(workbook, sheet, 'Sheet 1');
    await xlsx.writeFile(workbook, outputFilePath);

    console.log(`Conversion from JSON to XLSX successful!`);
};

(async function () {
    const rawData: IData[] = await require("./data.json");
    const groupedYear: IData[][] = await groupeByYear(rawData);

    let groupedYearAndMonth: IData[][][] = [];

    for await (const year of groupedYear) {
        groupedYearAndMonth.push(await groupeByMonth(year));
    }

    let result: object[] = [];
    for await (const register of groupedYearAndMonth) {
        result.push(...await jsonFormat(register));
    }

    await convertToXlsx(result, 'output.xlsx');

})();
