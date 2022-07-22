import axios from 'axios';
import { scrapeHTML } from 'scrape-it';

interface DateInfo {
    date: string;
    day: string;
    startTime: string;
    endTime: string;
    status: string;
}

const getVacantDates = async () => {
    const url = 'https://www.undoukai-reserve.com/lectureclass/system/prog/select_program.php';
    const res = await axios.post(url, {
        categories_id: 1,
        courses_id: 2,
        submit: '送信',
    });
    if (res.status === 200) {
        const data = scrapeHTML<{
            tables: {
                rows: DateInfo[];
            }[];
        }>(res.data, {
            tables: {
                listItem: 'table[bgcolor="#888888"]',
                data: {
                    rows: {
                        listItem: 'tbody tr[bgcolor="#ffffff"]',
                        data: {
                            date: {
                                selector: 'td',
                                eq: 0,
                            },
                            day: {
                                selector: 'td',
                                eq: 1,
                            },
                            startTime: {
                                selector: 'td',
                                eq: 2,
                            },
                            endTime: {
                                selector: 'td',
                                eq: 3,
                            },
                            status: {
                                selector: 'td',
                                eq: 7,
                            },
                        },
                    },
                },
            },
        });
        const schedules = data.tables.map(table => table.rows).flat();
        schedules.filter(schedule => schedule.status !== '満員');
        return schedules;
    } else {
        console.error('Response code is not 200');
        return [];
    }
};

const notifyVacances = async (dates: DateInfo[]) => {

};

const main = async () => {
    const vacantDates = await getVacantDates();
    if (vacantDates.length > 0) {
        await notifyVacances(vacantDates);
    }
};

