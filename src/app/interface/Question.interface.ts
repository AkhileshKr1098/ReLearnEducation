export interface Week {
    id: number,
    week_num: number
}

export interface WeekRes {
    success: number,
    data: Week
}

export interface WeekInsertRes {
    message: string,
    success: number
}

export interface Day {
    id: number,
    day: number,
    week_id: number,
    week_num: number

}

export interface DayRes {
    success: number,
    data: Day
}



export interface Grade {
    id: number;
    day: number,
    day_id: number;
    grade: number;
    week_id: number;
    week_num: number;
}
export interface GradeRes {
    success: number,
    data: Grade
}



export interface Class {
    class: string,
    id: number
}

export interface ClassRes {
    data: Class,
    success: number,

}



export interface Sections {
    id: number;
    sections_name: string
}
export interface SectionsRes {
    success: number,
    data: Sections
}
export interface SectionsFilter {
    id: number,
    class: string,
    week: string,
    sections: string

}
export interface SectionsFilterRes {
    success: number,
    data: SectionsFilter
}

export interface Topics {
    id: number,
    sections: string,
    topics: string,
    topics_img: string
}
export interface TopicsRes {
    data: Topics,
    success: number

}


export interface SubTopic {
    id?: number;
    sub_topics: string;
    topics: string;
}

export interface SubTopicRes {
    data: SubTopic,
    success: number
}


export interface DayInfo {
    day: string;
    day_id: string;
    grade: string;
    grade_id: string;
    id: string;
    sections: string;
    week_id: string;
    week_num: string;
}



export interface QuestionData {
    Answer: string;
    OptionA: string;
    OptionB: string;
    OptionC: string;
    OptionD: string;
    Question: string;
    instruction: string;
    class: string;
    day: string;
    id: number;
    incomplete_word: string;
    listen_rec: string;
    listen_word: string;
    question_Img: string;
    question_type: string;
    sections: string;
    sub_topics: string;
    topics: string;
    unit: string;
    week: string;
    video_url_youtube: string;
    video_url_local: string;

}


export interface QuestionDataRes {
    success: number,
    data: QuestionData
}

export interface AnsReport {
    id: number;
    std_id: string;
    class: string;
    sections: string;
    topics: string;
    question_id: string;
    answer_image: string;
    answer_status: number;
    teacher_id_fk: number;
    cur_date: string; // ISO format (e.g., "2025-04-29")
    day: string;
    week: string;
    total_qty: number;
    right_ans: number;
    wrong_ans: number;
}

export interface AnsReportRes {
    data: AnsReport,
    success: number
}

export interface AnswerWithQuestion {
    id: number;
    class: string;
    week: string;
    day: string;
    sections: string;
    topics: string;
    sub_topics: string;
    unit: string;
    question_type: string;
    instruction: string;
    Question: string;
    OptionA: string;
    OptionB: string;
    OptionC: string;
    OptionD: string;
    Answer: string;
    question_Img: string | null;
    incomplete_word: string | null;
    listen_word: string | null;
    listen_rec: string | null;
    answer_status: number;
    answer_image: string;
    std_id: string;
    cur_date: string;
    std_answer: string
}

export interface AnswerWithQuestionRes {
    data: AnswerWithQuestion,
    success: number
}

