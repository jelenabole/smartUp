export class Result {
    subjects: Subject[];
}

export class Subject {
    date: OnDate[];
}

export class OnDate {
    quizzes: Quiz[];
}

export class Quiz {
    numberOfQuestions: number;
    points: number;
    quizName: string;
    timestamp: string;
}

export class DailyPoints {
    date: string;
    points: number;
}

