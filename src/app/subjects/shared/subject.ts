import { Classroom } from "../../classrooms/shared/classroom";

export class Subject {
  // TODO - ID should be generated for the QR, should be unique for the whole base
  // QR can be a combo of prof and subject ID
  $key: string;
  name: string;

  // TODO - delete this later, professor ID:
  // professor KEY (google account)
  owner?: string;

  // added fields:
  // TODO - name should be unique for the professor:
  active? = true; // to "delete" or not show
  timeStamp?: number; // when it was made

  // quizzes = id, name ()
  quizzes?: Quiz[];

}

// TODO - subjects are just the name and the subject ID from professor
// this is just a reference to the current professors subjects
export class Quiz {
  key?: string;
  name: string;
  questions: Question[];
  // other fields: quizzes, results from previous quizzes, ...
}

export class Question {
  text: string;
  answers: Answer[];
}

export class Answer {
  text: string;
  correct = false;
}

// quiz that started
export class StartedQuiz {
  key?: string;
  quiz: Quiz;
  classArrayNo?: number; // number of quiz in class array (for givenAnswers)

  // for synced quizzes:
  isSynced: boolean = true;
  isStarted?: boolean = false;
  activeStudents: ActiveStudent[] = [];

  // time and students:
  secondsPerQuestion: number = 10;
  openUntil?: string;
  classroom?: Classroom;
  active: boolean = true;

  classroomName?: string;
  classroomKey?: string;
  subjectName?: string;
  subjectKey?: string;
  professorName: string;

  /*
  classroomKey?: string;
  quizKey?: string;
  */
}

export class ActiveStudent {
  index: number;
  key?: string;
  name: string;
  points: 0;
  started: boolean = false;
}
