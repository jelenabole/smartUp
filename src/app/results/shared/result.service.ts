import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';

import { Observable } from 'rxjs/Observable';
import { FirebaseApp } from 'angularfire2';
import { AuthService } from '../../core/auth.service';
import { User } from 'firebase/app';
import { MyUser } from '../../shared/user.service';

import { first, take } from 'rxjs/operators';
import { Result, DailyPoints } from './result';

@Injectable()
export class ResultService {

  currentUser: MyUser;

  constructor(private db: AngularFireDatabase, public auth: AuthService) {

    // reset user-a ukoliko je krivi:
    auth.user.subscribe(authData => {
      if (authData != null) {
        // get info by the displayname
        if (authData.displayName != undefined) {
          //console.log("REFRESHED");
          //console.log(authData);

          // var user = userService.getUserByDisplayName(authData.displayName);
          // od tog usera, dohvatiti sve podatke:
        }
        //console.log(authData);
        auth.currentUser = auth.mapToMyUser(authData);
        this.currentUser = auth.currentUser;
        //console.log(auth.currentUser);
      }
    });
  }

  getResults(userKey: string): Observable<Result[] | null> {
    const quizPath = `users/${userKey}/quizzes`;
   return this.db.list(quizPath).snapshotChanges().map((arr) => {
     return arr.map((snap) => Object.assign(snap.payload.val(), { $key: snap.key }) );
   });
  }

  getDailyPoints(userKey: string): Observable<DailyPoints[] | null> {
    const quizPath = `users/${userKey}/pointsDaily`;
   return this.db.list(quizPath).snapshotChanges().map((arr) => {
     return arr.map((snap) => Object.assign(snap.payload.val(), { $key: snap.key }) );
   });
  }
  
}



