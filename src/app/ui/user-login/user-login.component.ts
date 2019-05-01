import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { UserService, MyUser } from '../../shared/user.service';

@Component({
  selector: 'user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent {

  // TODO - number of photos:
  private numberOfPhotos = 3;

  private basePath = '/users';
  private usersRef: AngularFireList<MyUser>;
  private userRef: AngularFireObject<MyUser>;

  private existingUsers: Array<MyUser>;
  private userUpdated = false;
  private numberOfUsers = 0;


  private studentName: string;
  private studentPassword: string;
  loginMessage: string;



  users: Observable<MyUser[]>;
  arrayOfUsers: Observable<Array<MyUser>>;

  constructor(public auth: AuthService, private router: Router, 
          private db: AngularFireDatabase, private userService: UserService) { 
    this.usersRef = db.list(this.basePath);
    this.existingUsers = [];

    this.getUsersList().forEach(el => {
      el.forEach(element => {
        this.existingUsers.push(element);
        //console.log(element);
      })
    });

    this.users = this.getUsersList();

    this.users.forEach(x => {
      //console.log(x);
      x.forEach(user => {
        if (user.email == "") {
          this.numberOfUsers++;
        }
      });
    });

    this.auth.user.subscribe(authData => {
      if (authData != null) {
        //console.log("LOG IN");
        // znači da auth nekakav postoji:
        if (authData.displayName != undefined) {
          // "unknown" je kada ima ime:
          if (authData.displayName != "unknown") {
            //console.log("update nije potreban!");
            return;
          } else if (this.studentName != "") { // ako nema ime, onda je ulogiran postojeći user
            //console.log("login postojećeg usera");
            //console.log(this.studentName);
            auth.currentUser = this.getUserByDisplayName(this.studentName);
          } else {
            //console.log("BREAK");
            return;
          }
          //console.log("current user: " + authData.displayName);
          //auth.currentUser = this.getUserByDisplayName(authData.displayName);
          //console.log(auth.currentUser);
        }

        //console.log("Test");

        if (authData.email == null) {
          // no email - anonymous = student
          // console.log("anonimni = PUSH");

          // XXX - find user in DB
         // console.log("label: -----");
         // console.log(this.studentName);
          auth.currentUser = this.getUserByDisplayName(this.studentName);
          if (auth.currentUser == undefined) {
            var student = new MyUser();

            // DEFAULT NAZIV STUDENTA:
            // var timestamp = Date.now();
            // student.displayName = "Student-" + timestamp;
            
            student.displayName = this.studentName;
            student.email = "";
            student.professor = false;
            student.classrooms = ["test-classroom"];

            // XXX - set the image by the current number of users:
            
            //console.log("ukupno učenika: " + this.numberOfUsers);
            //console.log("number of users: " + userNumber);
            var photoNumber = this.numberOfUsers % this.numberOfPhotos + 1;

            student.photoURL = this.auth.getPhotoByNumber(photoNumber);
            auth.currentUser = student;
            //console.log("student novi");
            
            //this.auth.updateUser(authData, this.studentName, student.photoURL);

            var newKey = this.usersRef.push(student).key;
            if (newKey != null) {
              student.key = newKey;
              this.usersRef.set(newKey, student);
            }
            auth.currentUser.key = student.key;

            if (!this.userUpdated) {
              console.log("update user");
              this.auth.updateUser(authData, auth.currentUser);
            }
            this.userUpdated = !this.userUpdated;
          } else {
            //console.log("student already exists");
            auth.currentUser = this.getUserByDisplayName(this.studentName);
            //console.log("student dohvaćen");
            this.auth.updateUser(authData, auth.currentUser);
          }
        } else {
          auth.currentUser = this.getUserByEmail(authData.email);
          //console.log(this.currentUser);

          if (auth.currentUser == undefined) {
            // console.log("gmail = PUSH");

            var timestamp = Date.now();
            var professor = new MyUser();
            professor.displayName = authData.displayName == undefined ? "Prof-" + timestamp : authData.displayName;
            professor.email = authData.email;
            professor.professor = true;
  
            professor.classrooms = ["test-razred"];
            professor.subjects = ["test-predmet"];
  
            auth.currentUser = professor;
           // console.log("profesor novi");
            //console.log(auth.currentUser);

            this.usersRef.push(professor);
            // XXX - set new one to currentUser:
            auth.currentUser = this.getUserByEmail(professor.email);
          } else {
            //console.log("professor already exists");
            auth.currentUser = this.getUserByEmail(authData.email);
            //console.log("profesor dohvaćen");
            //console.log(auth.currentUser);
          }
        }
      } else {
        //console.log("auth je null");
        auth.currentUser = new MyUser();
        this.studentName = "";
        //console.log("user obrisan");
        //console.log(auth.currentUser);
      }
    });
    
            /*
    this.usersRef = db.list(this.basePath);
    this.existingUsers = [];
    this.getUsersList().forEach(el => {
      el.forEach(element => {
        this.existingUsers.push(element);
        //console.log(element);
      })
    });

    this.users = this.getUsersList();

    this.auth.user.subscribe(authData => {
      if (authData != null) {

        // XXX - dodatna provjera - logout
        if (authData.email == null) {
          if (this.studentName == "jelena" || this.studentName == "viva") {}
          else auth.signOut();
        } else {
          if (authData.email == "jelenabole@gmail.com" || authData.email == "vivalagreen23@gmail.com") {}
          else auth.signOut();
        }
        


        if (authData.email == null) {
          
        } else {
          this.currentUser = this.getUserByEmail(authData.email);
          //console.log(this.currentUser);

          if (this.currentUser == undefined) {
           // console.log("gmail = PUSH");

            var timestamp = Date.now();
            var professor = new MyUser();
            professor.displayName = authData.displayName == undefined ? "Prof-" + timestamp : authData.displayName;
            professor.email = authData.email;
            professor.professor = true;
  
            professor.classrooms = ["test-classroom"];
            professor.subjects = ["test-subject"];
  
            auth.currentUser = professor;
            console.log("profesor novi");
            console.log(auth.currentUser);

            this.usersRef.push(professor);
            // XXX - set new one to currentUser:
            this.currentUser = this.getUserByEmail(professor.email);
          } else {
            //console.log("professor already exists");
            auth.currentUser = this.getUserByEmail(authData.email);
            console.log("profesor dohvaćen");
            console.log(auth.currentUser);
          }
        }
      } else {
        //console.log("auth je null");
        auth.currentUser = new MyUser();
        console.log("user obrisan");
        console.log(auth.currentUser);
      }
    });
    */
  }

  logout() {
    this.studentName = "";
    this.auth.signOut();
  }
  
  registerStudent() {
    // provjeriti da li korisnik posotji
    // ako displayName se ne koristi već, upisati novog korisnika
    // ulogirati ga

    this.users = this.getUsersList();
    var check = this.getUserByDisplayName(this.studentName);

    if (check != undefined) {
      this.loginMessage = "Korisničko ime je zauzeto";
      return;
    } else {
      console.log(" - register user");
      this.loginMessage = "";

      console.log("anonimni = PUSH");

      // new user:
      var student = new MyUser();
      student.displayName = this.studentName;
      student.email = "";
      student.professor = false;
      student.classrooms = ["test-razred"];
      
      // XXX - set the image by the current number of users:
      var userNumber = 0;
      // TODO - dohvatiti sve korisnike, tj broj;
      var photoNumber = userNumber % this.numberOfPhotos + 1;

      student.photoURL = this.auth.getPhotoByNumber(photoNumber);

      this.usersRef.push(student);
      // TODO - changed authData, with student
      // this.auth.updateUser(, this.studentName, student.photoURL);
      // auth.currentUser = student;
      }
      // upisati podatke, update Usera, i sign it
      this.signInAnonymously();
  }

  loginStudent() {
    this.users = this.getUsersList();
    var check = this.getUserByDisplayName(this.studentName);

    if (check != undefined) {
      console.log("user exists");
      if (check.password != undefined) {
        console.log("user exists");
        this.loginMessage = "Krivo korisničko ime ili lozinka!"
      } else {
        console.log("user doesnt exist");
      }
    } else {
      this.loginMessage = "krivo korisničko ime ili lozinka!";
    }
  }

  testButton() {
    this.users = this.getUsersList();
    var check = this.getUserByDisplayName(this.studentName);

    if (check != undefined) {
      console.log("user exists");
      if (check.password != undefined) {
        console.log("user exists");
      } else {
        console.log("user doesnt exist");
      }
    } else {
      console.log("user doesnt exist");
      this.loginMessage = "korisnik ne postoji";
    }


    // this.arrayOfUsers = this.getUsersList();

    //this.existingUsers.forEach(check => (console.log(check)));

    console.log(this.userService.currentUser);
    this.studentName = "";
    this.studentPassword  ="";
    //this.currentUser = this.getUserByDisplayName("jelena");
   // this.currentUser = this.getUserByDisplayName(this.studentName);

    this.auth.user.subscribe(authData => {
      //console.log(authData);
      if (authData != null) {
        console.log("user data changed:");
        console.log(authData);
      } else {
        console.log("user logged out");
      }
    });
  }


  private getUserByEmail(email: String): MyUser {
    return this.existingUsers.filter(user => user.email == email)[0];
  }

  private getUserByDisplayName(name: String): MyUser {
    return this.existingUsers.filter(user => user.displayName == name)[0];
  }

  getCurrentUser(): MyUser {
    return this.auth.currentUser;
  }

 
  /// Social Login

  signInWithGoogle() {
    this.auth.googleLogin()
      .then(() => this.afterSignIn());
  }

  /// Anonymous Sign In

  signInAnonymously() {
    this.auth.anonymousLogin()
      .then(() => {
        this.afterSignIn()
      });
  }

  /// Shared

  getUsersList(): Observable<MyUser[]> {
    return this.usersRef.snapshotChanges().map((arr) => {
      return arr.map((snap) => Object.assign(snap.payload.val(), { $key: snap.key }) );
    });
  }


  private afterSignIn() {
    // Do after login stuff here, such router redirects, toast messages, etc.
    
    // TODO - redirect on another page (quizzes) - depeding on if its professor or student
    //check if the user already exists, if not put it in:
    //this.usersRef.push();
    // add test subjects, quizzes, ... put it in classroom

    // TODO - this is an Observable array:

    /*
    console.log("after signin");
    this.auth.user.subscribe(authData => {
      //console.log(authData);
      if (authData != null) {
        console.log("user data changed:");
        console.log(authData);
      } else {
        console.log("user logged out");
      }
    });
    */
    console.log("sign in");
    //console.log(this.auth.currentUser.email);

    //this.router.navigate(['/']);
  }

}
