import { Subject } from "../../subjects/shared/subject";

export class Exercise {
  // TODO - ID should be generated for the QR, should be unique for the whole base
  // QR can be a combo of prof and subject ID
  $key?: string;

  name: string;
  questions: Question[];

}

export class Question {
  question: string;
  answers: string[];
}