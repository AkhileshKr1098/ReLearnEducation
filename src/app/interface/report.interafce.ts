export interface CurrentReportRes {
    success: number;
    today_report: {
        total: number;
        correct: number;
        incorrect: number;
        correct_percent: number;
        incorrect_percent: number
    };
    topic_wise_report: {
        total: number;
        correct: number;
        incorrect: number;
        correct_percent: number;
        incorrect_percent: number
    };
}