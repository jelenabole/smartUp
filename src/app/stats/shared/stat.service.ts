import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';

import { Classroom, Student } from './stat';

import { Observable } from 'rxjs/Observable';
import { FirebaseApp } from 'angularfire2';
import { AuthService } from '../../core/auth.service';
import { User } from 'firebase/app';
import { UserProfileComponent } from '../../ui/user-profile/user-profile.component';
import { Subject, Quiz } from '../../subjects/shared/subject';
import { UserLoginComponent } from '../../ui/user-login/user-login.component';
import { UserService } from '../../shared/user.service';

@Injectable()
export class StatService {

  private basePath = '/classrooms';
  classroomsRef: AngularFireList<Classroom>;
  classroomRef:  AngularFireObject<Classroom>;

  constructor(private db: AngularFireDatabase, public auth: AuthService,
    private userService: UserService) {
    this.classroomsRef = db.list(this.basePath);

    // dohvatiti trenutnog usera:
    var currentUser = userService.getCurerrentUser();

    

    // TODO - remove this somewhere safer:
    /*
    this.auth.user.subscribe(authData => {
      //console.log(authData);
      this.currentUser = authData;
      if (authData) {
        this.currentUserID = authData.uid;
      }
      //console.log(this.currentUserID);
    });
    */
  }
  

  


  // Return an observable list of Classrooms
  getClassroomsList(): Observable<Classroom[]> {
    return this.classroomsRef.snapshotChanges().map((arr) => {
      return arr.map((snap) => Object.assign(snap.payload.val(), { $key: snap.key }) );
    });
  }

  // Return a single observable item
  getClassroom(key: string): Observable<Classroom | null> {
    const classroomPath = `${this.basePath}/${key}`;
    const classroom = this.db.object(classroomPath).valueChanges() as Observable<Classroom | null>;
    return classroom;
  }

  addPadding(num: number): string {
    if (num < 10) {
      return "0" + num;
    }
    return '' + num;
  }

  // Update an exisiting item
  updateClassroom(key: string, value: any): void {
    this.classroomsRef.update(key, value);
  }

  // Default error handling for all actions
  private handleError(error: Error) {
    console.error(error);
  }

}
