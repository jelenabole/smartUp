import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AuthService } from '../core/auth.service';
import { first, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';


interface User {
  uid: string;
  email?: string | null;
  photoURL?: string;
  displayName?: string;
  professor: boolean;
};

export class MyUser {
  key?: string;
  displayName: string;

  // za studenta:
  password?: string;
  photoURL: string;
  points?: number;
  quizzes: string[];
  // za profesora:
  email: string;
  classrooms: string[];
  subjects: string[];

  professor: boolean;
  active = true;
}


@Injectable()
export class UserService {

  private basePath = '/users';
  usersRef: AngularFireList<MyUser>;
  userRef:  AngularFireObject<MyUser>;
  user: MyUser;
  existingUsers: Array<MyUser>; 

  currentUser: MyUser;

  constructor(private db: AngularFireDatabase, public auth: AuthService) {
  }

  getUsersList(): Observable<MyUser[]> {
    return this.usersRef.snapshotChanges().map((arr) => {
      return arr.map((snap) => Object.assign(snap.payload.val(), { $key: snap.key }) );
    });
  }

  getCurerrentUser() {
    return this.user;
  }

  connectUser() {
    console.log(this.auth.user.pipe(first()).pipe(
      tap(user => {
        if (user) {
          // do something
          console.log(user);
          this.user = new MyUser();
          this.mapToUser(user);
          console.log("ovaj user");
          console.log(this.user);
        } else {
          // do something else
        }
      })
    ).subscribe());
  }

  mapToUser(user: User) {
    this.user = new MyUser();
    this.user.email = user.email ? user.email : "";
    this.user.displayName = user.displayName ? user.displayName : "guest";
    this.user.professor = (user.email != null);

    // dohvatiti sve podatke iz baze:
    // ili po mailu (ukoliko postoji), ili po imenu
    if (user.email != null) {
      this.currentUser = this.getUserByEmail(user.email);
    } else {
      this.currentUser = this.getUserByDisplayName(this.user.displayName);
    }
     
  }

  getUserByEmail(email: string): MyUser {
    return this.existingUsers.filter(user => user.email == email)[0];
  }

  getUserByDisplayName(name: string): MyUser {
    return this.existingUsers.filter(user => {
      if(user.displayName == name) {
        return true;
      }
    })[0];
  }


}

