import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';

import { Subject, Quiz, Question, StartedQuiz } from './subject';

import { Observable } from 'rxjs/Observable';
import { FirebaseApp } from 'angularfire2';
import { AuthService } from '../../core/auth.service';
import { SubjectFormComponent } from '../subject-form/subject-form.component';
import { Classroom } from '../../classrooms/shared/classroom';

@Injectable()
export class SubjectService {

  private basePath = '/subjects';
  subjectsRef: AngularFireList<Subject>;
  subjectRef:  AngularFireObject<Subject>;

  classrooms: Classroom[];
  professorName: string;

  constructor(private db: AngularFireDatabase, public auth: AuthService) {
    this.subjectsRef = db.list(this.basePath);

    // TODO - get classrooms from that professor (for starting Quiz)
    db.list('/classrooms').valueChanges().subscribe(items => {
      //console.log(items as Classroom[]);
      this.classrooms = items as Classroom[];
    });

    auth.user.subscribe(authData => {
      if (authData != null) {
        if (authData.displayName != undefined) {
          //console.log("REFRESHED");
          this.professorName = authData.displayName;
        }
        auth.currentUser = auth.mapToMyUser(authData);
      }
    });
  }

  getClassrooms(): Classroom[] {
    return this.classrooms;
  }


  // Return an observable list of Classrooms
  getSubjectsList(): Observable<Subject[]> {
    return this.subjectsRef.snapshotChanges().map((arr) => {
      return arr.map((snap) => Object.assign(snap.payload.val(), { $key: snap.key }) );
    });
  }

  // Return a single observable item
  getSubject(key: string): Observable<Subject | null> {
    const subjectPath = `${this.basePath}/${key}`;
    const subject = this.db.object(subjectPath).valueChanges() as Observable<Subject | null>;
    return subject;
  }


  /********* Methods needed ***********/


  // Create a brand new item
  createSubject(subject: Subject): void {
    this.subjectsRef.push(subject);
  }

  // Update an exisiting item
  updateSubject(key: string, value: any): void {
    this.subjectsRef.update(key, value);
  }

  // Deletes a single item
  deleteSubject(key: string): void {
    if (key != undefined)
      this.subjectsRef.remove(key);
  }

  // Default error handling for all actions
  private handleError(error: Error) {
    console.error(error);
  }


  /*** other functions - QUIZ ***/

  // XXX - create quiz = creates a new quiz in array and saves subject
  // XXX - update quiz = updates the array and saves Subject
  // XXX - delete quiz = deletes from the array and saves changes to Subject

  // Create a brand new item - When connecting Subject and Classroom
  createQuiz(quiz: StartedQuiz): void {
    // minutes per question
    // list of students (from the classroom)
    // type of quiz
    // classroom ID (will be deleted maybe)

    this.db.list('/quizzes').push(quiz);
  }

  copyQuizToPublic(quiz: StartedQuiz): void {
    this.db.list('/exercises').push(quiz);
  }

}
