import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { StartedQuiz } from '../../professor/subjects/subject';
import { Exercise } from './exercise';

@Injectable()
export class ExerciseService {

  private basePath = '/exercises';
  exercisesRef: AngularFireList<StartedQuiz>;
  // exerciseRef:  AngularFireObject<StartedQuiz>;

  constructor(private db: AngularFireDatabase) {
    this.exercisesRef = db.list(this.basePath);
  }

  // Return an observable list of Exercises
  getExercisesList(): Observable<Exercise[]> {
    return this.exercisesRef.snapshotChanges().map((arr) => {
      return arr.map((snap) => Object.assign(snap.payload.val(), { $key: snap.key }) );
    });
  }

  // Return a single observable item
  getExercise(key: string): Observable<Exercise | null> {
    const exercisePath = `${this.basePath}/${key}`;
    return this.db.object(exercisePath).valueChanges() as Observable<Exercise | null>;
  }

  // Default error handling for all actions
  private handleError(error: Error) {
    console.error(error);
  }

}
