import { Subject } from "../../subjects/shared/subject";

export class Classroom {
  // TODO - ID should be generated for the QR, should be unique for the whole base
  // QR can be a combo of prof and subject ID
  $key?: string;
  // TODO - delete this later, professor ID:
  // professor KEY (google account)
  owner?: string;
  code?: string;
  // added fields:
  // TODO - name should be unique for the professor:
  name: string;
  active = true; // to "delete" or not show
  timeStamp: number; // when it was made
  // student = id, name (results, points, ...)
  
  students: Student[];

  quizzes: Quiz[];
}

// TODO - connect students over the ID that they will get (based on the device #)
export class Student {
  key?: string;
  name: string;
  points: number;
}


//********* KVIZOVI ***********/

export class Quiz {
  key?: string; // nije dodan zapis
  isSynced: boolean;
  openUntil: string;
  questions: Question[];

  quizName: string;
  secondsPerQuestion: number;
}

export class Question {
  text: string;
  givenAnswers: Answer[];
  percent?: number;
}

export class Answer {
  answer: string;
  correct: boolean;
  student: string; //name
  time: number;
}