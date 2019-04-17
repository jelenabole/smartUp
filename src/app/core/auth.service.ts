import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { NotifyService } from './notify.service';

import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';


interface User {
  uid: string;
  key?: string;
  points?: number;
  email?: string | null;
  photoURL?: string;
  displayName?: string;
  professor: boolean;
}


export class MyUser {
  uid?: string;
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


export enum Avatar {
  default = "https://firebasestorage.googleapis.com/v0/b/smartup-1234.appspot.com/o/default.png?alt=media&token=5744981e-20c4-4d0d-8806-c05d833336f4",
  tiger = "https://firebasestorage.googleapis.com/v0/b/smartup-1234.appspot.com/o/tiger.png?alt=media&token=acdb9cce-3e0e-4d23-b863-aa6899b8e94d",
  panda = "https://firebasestorage.googleapis.com/v0/b/smartup-1234.appspot.com/o/panda.png?alt=media&token=91e2f7b3-631e-49c7-8f92-74a21e93e52f",
  wolf = "https://firebasestorage.googleapis.com/v0/b/smartup-1234.appspot.com/o/wolf.png?alt=media&token=97d3ea8e-97d7-4282-a881-4227d413b1ec",
  fox = "https://firebasestorage.googleapis.com/v0/b/smartup-1234.appspot.com/o/fox.png?alt=media&token=40eb5223-a5e2-4404-b913-007bac7745b0",
}


@Injectable()
export class AuthService {

  user: Observable<User | null>;
  private usersRef: AngularFireList<MyUser>;
  users: Observable<MyUser[]>;

  currentUser: MyUser;

  myUser: Observable<MyUser | null>;
  currentUserKey: string;

  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private router: Router,
              private notify: NotifyService,
              private db: AngularFireDatabase) {

    this.user = this.afAuth.authState
      .switchMap((user) => {
      // happens every refresh or page change
      // console.log("check UID");
      if (user) {
        return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
      } else {
        return Observable.of(null);
      }
    });

    this.user.subscribe(data => {
      //console.log("CHECK --------");
      // XXX - each refresh
      if (data && data.key) {
        // get user by displayName:
        console.log("DATA --------");
        console.log(data);
        this.currentUserKey = data.key;
        this.myUser = this.getUser(data.key);
      } else {
        // TODO - obrisati current user-a
        //console.log("null");
        this.myUser = Observable.of(null);
      }
    });

    this.usersRef = db.list('/users');
    /*
    this.users = this.getUsersList();
    */
  }
 
  getUsersList(): Observable<MyUser[]> {
    return this.usersRef.snapshotChanges().map((arr) => {
      return arr.map((snap) => Object.assign(snap.payload.val(), { $key: snap.key }) );
    });
  }

  /*
  private getUserByDisplayName(name: String): MyUser {
    return this.existingUsers.filter(user => user.displayName == name)[0];
  }
  */

  getUser(key: string): Observable<MyUser | null> {
    const userPath = `users/${key}`;
    const user = this.db.object(userPath).valueChanges() as Observable<MyUser | null>;
    return user;
  }

  ////// OAuth Methods /////

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider: firebase.auth.AuthProvider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        //this.notify.update('Welcome!', 'success');
        this.router.navigate(['/exams']);
        return this.updateUserData(credential.user);
      })
      .catch((error) => this.handleError(error) );
  }

  //// Anonymous Auth ////

  anonymousLogin() {
    return this.afAuth.auth.signInAnonymously()
      .then((user) => {
        //this.notify.update('Welcome!', 'success');
        this.router.navigate(['/quizzes']);
        return this.updateUserData(user); // if using firestore
      })
      .catch((error) => {
        console.error(error.code);
        console.error(error.message);
        this.handleError(error);
      });
  }

  //// Email/Password Auth ////

  emailSignUp(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        this.notify.update('Welcome!!!', 'success');
        return this.updateUserData(user); // if using firestore
      })
      .catch((error) => this.handleError(error) );
  }

  emailLogin(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.notify.update('Welcome!!!', 'success')
        return this.updateUserData(user); // if using firestore
      })
      .catch((error) => this.handleError(error) );
  }

  // Sends email allowing user to reset password
  resetPassword(email: string) {
    const fbAuth = firebase.auth();

    return fbAuth.sendPasswordResetEmail(email)
      .then(() => this.notify.update('Password update email sent', 'info'))
      .catch((error) => this.handleError(error));
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
        this.router.navigate(['/login']);
    });
  }

  // If error, console log and notify user
  private handleError(error: Error) {
    this.notify.update(error.message, 'error');
  }

  // Sets user data to firestore after succesful login
  private updateUserData(user: User) {
    //console.log("update user");
    // XXX - called after login functions (anonym, google)

    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    // if this user exists:
    //console.log("update user data");
    //console.log(user);
    //user = this.checkIfUserExists(user);

    const data: User = {
      uid: user.uid,
      key: user.key || '',
      email: user.email || null,
      displayName: user.displayName || 'unknown',
      points: user.points || 0,
      photoURL: user.photoURL || Avatar.default,

      //"https://firebasestorage.googleapis.com/v0/b/smartup-123.appspot.com/o/avat-0.png?alt=media&token=8aa7303f-4b11-49ef-abe7-82fbf25fbc48",
      professor: user.email != null
    };
    return userRef.set(data);
  }
















  
  private checkIfUserExists(user: User): User {
    console.log("check if exists");
    console.log(this.usersRef);
    console.log(this.users);

    console.log(user);

     

    /*
    if (authData != null) {
      if (authData.email == null) {
        
      } else {
        this.currentUser = this.getUserByEmail(authData.email);
        //console.log(this.currentUser);

        if (this.currentUser == undefined) {
          console.log("gmail = PUSH");

          var timestamp = Date.now();
          var professor = new MyUser();
          professor.displayName = authData.displayName == undefined ? "Prof-" + timestamp : authData.displayName;
          professor.email = authData.email;
          professor.professor = true;

          professor.classrooms = ["test-classroom"];
          professor.subjects = ["test-subject"];

          this.usersRef.push(professor);
          // XXX - set new one to currentUser:
          this.currentUser = this.getUserByEmail(professor.email);
        } else {
          console.log("professor already exists");
        }
      }
    } else {
      console.log("auth je null");
      this.currentUser = null;
    }
  });
  */

    return user;
  }

  // XXX - added function for updating name and image
  public updateUser(user: User, myUser: MyUser) {

    var newUser: User = {
      uid: user.uid,
      key: myUser.key || '',
      email: user.email || null,
      displayName: myUser.displayName || 'unknown',
      points: myUser.points || 0,
      //photoURL: 'gs://smartup-123.appspot.com/avat-' + photo + '.png',
      photoURL: myUser.photoURL,
      professor: user.email != null
    };
    // mapirati:
    this.currentUser = this.mapToMyUser(newUser);
    this.updateUserData(newUser);
  }

  mapToMyUser(user: User) {
    console.log("map to user");
    console.log(user);
    var newUser: MyUser = {
      uid: user.uid,
      key: user.key || '',
      displayName: user.displayName || '',
      email: user.email || '',
      professor: user.professor,
      photoURL: user.photoURL ||'',
      active: true,

      // reference keys:
      classrooms: [],
      subjects: [],
      quizzes: []
    };
    return newUser;
  }

  public getPhotoByNumber (number: number): string {
    var listOfImages = [Avatar.fox, Avatar.panda, Avatar.tiger, Avatar.wolf];
    var index = number % listOfImages.length;

    return listOfImages[index];
  }

}

