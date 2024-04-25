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
    // console.log(group);

    return group;
};

const jsonMaker = (data: IData[][]) => {
    const m1 = data[0];


    for (const day of m1) {

    }

};

(async function () {
    const rawData: IData[] = await require("./data.json");
    const groupedYear: IData[][] = await groupeByYear(rawData);

    let groupedYearAndMonth: IData[][][] = [];

    for await (const year of groupedYear) {
        groupedYearAndMonth.push(await groupeByMonth(year));
    }

    jsonMaker(groupedYearAndMonth[0]);

})();
