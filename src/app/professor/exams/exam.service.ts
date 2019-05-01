import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../core/auth.service';
import { StartedQuiz } from '../subjects/subject';
import { UserService } from '../../shared/user.service';
import { QuizService } from '../../student/quizzes/quiz.service';
import { Exam } from './exam';

@Injectable()
export class ExamService {

  private basePath = '/quizzes';
  examsRef: AngularFireList<StartedQuiz>;
  examRef:  AngularFireObject<StartedQuiz>;

  professorName: string;

  constructor(private db: AngularFireDatabase, public auth: AuthService,
    public userService: UserService, public quizService: QuizService) {
    this.examsRef = db.list(this.basePath);

    //console.log(auth.currentUser);
    // reset user-a ukoliko je krivi:
    auth.user.subscribe(authData => {
      if (authData != null) {
        // get info by the displayname
        if (authData.displayName != undefined) {
          // var user = userService.getUserByDisplayName(authData.displayName);
          // od tog usera, dohvatiti sve podatke:
          this.professorName = authData.displayName;
        }
        auth.currentUser = auth.mapToMyUser(authData);
      }
    });
  }


  // create quiz and add it to classroom:
  createQuiz(quiz: StartedQuiz): void {
    var quizKey = this.db.list('/quizzes').push(quiz).key;
    // check the key:
    if (quizKey != null) {
      var arrayNo = this.quizService.addQuizToClassroom(quiz, quizKey);
      // write the quiz array number from class (for faster adding given answers);
      quiz.classArrayNo = arrayNo;
      this.db.list('/quizzes').update(quizKey, quiz);
    }
  }

  // Update an exisiting item
  updateExam(key: string, value: any): void {
    this.examsRef.update(key, value);
  }

  deleteQuiz(examKey: any) {
    if (examKey != undefined) {
      this.examsRef.remove(examKey);
    }
  }

  // Return an observable list of exams
  getExamsList(): Observable<Exam[]> {
    return this.examsRef.snapshotChanges().map((arr) => {
      return arr.map((snap) => Object.assign(snap.payload.val(), { $key: snap.key }) );
    });
  }

  // Return a single observable item
  getExam(key: string): Observable<Exam | null> {
    const examPath = `${this.basePath}/${key}`;
    const exam = this.db.object(examPath).valueChanges() as Observable<Exam | null>;
    return exam;
  }

   // Return a single observable item
   getStartedExam(key: string): Observable<StartedQuiz | null> {
    const examPath = `${this.basePath}/${key}`;
    const exam = this.db.object(examPath).valueChanges() as Observable<StartedQuiz | null>;
    return exam;
  }

  deleteStudentFromQuiz(quizKey: string, index: number) {
    // delete student on index:
    const examPath = `quizzes/${quizKey}/activeStudents/${index}`;
    this.db.object(examPath).remove();
  }

  // Default error handling for all actions
  private handleError(error: Error) {
    console.error(error);
  }

}
