import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';

import { Classroom, Student } from './classroom';

import { Observable } from 'rxjs/Observable';
import { FirebaseApp } from 'angularfire2';
import { AuthService } from '../../core/auth.service';
import { User } from 'firebase/app';
import { UserProfileComponent } from '../../ui/user-profile/user-profile.component';
import { ClassroomFormComponent } from '../classroom-form/classroom-form.component';
import { Subject, Quiz } from '../../subjects/shared/subject';
import { UserLoginComponent } from '../../ui/user-login/user-login.component';
import { UserService } from '../../shared/user.service';

@Injectable()
export class ClassroomService {

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
    // filtriraj samo one sa USER ID-em:
    /*
    console.log(this.classroomsRef.snapshotChanges().map((arr) => {
      return arr.map((snap) => Object.assign(snap.payload.val(), { $key: snap.key }) );
    }))
    */
    
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

  // Create a brand new item
  createClassroom(classroom: Classroom): void {
    // take time, and set it as a key (hh:mm dd.mm)
    var date = new Date();
    var string = this.addPadding(date.getHours()) + this.addPadding(date.getMinutes());
    string += this.addPadding(date.getDate()) + this.addPadding(date.getMonth());

    // add code and save it with that key:
    classroom.code = string;
    this.classroomsRef.update(string, classroom);
    //this.classroomsRef.push(classroom);
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

  // Deletes a single item
  deleteClassroom(key: string): void {
    this.classroomsRef.remove(key);
  }

  // Default error handling for all actions
  private handleError(error: Error) {
    console.error(error);
  }

  // Add student to classroom:
  addStudentToClassroom(code: string, studentKey: string, name: string) {
    this.db.database.refFromURL(`https://smartup-1234.firebaseio.com/classrooms/${code}`)
    .ref.ref.transaction(classroom => {
      //classroom.active = true;
      var exists = false;

      if (classroom != null) {
        if (classroom.students == null && classroom.studnets == undefined) {
          classroom.students = [];
        } else {
          for (var i = 0; i < classroom.students.length; i++) {
            if (classroom.students[i].key == studentKey) {
              exists = true;
            }
          }
        }
        // ako ne postoji - dodati studenta:
        if (!exists) {
          classroom.students.push({
            key: studentKey,
            name: name,
            points: 0
          });
        }
      }
      
      return classroom;
    });
  }

}
