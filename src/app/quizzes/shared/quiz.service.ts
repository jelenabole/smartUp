import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';

import { Question } from './quiz';

import { Observable } from 'rxjs/Observable';
import { FirebaseApp } from 'angularfire2';
import { AuthService } from '../../core/auth.service';
import { User } from 'firebase/app';
import { UserProfileComponent } from '../../ui/user-profile/user-profile.component';
import { Quiz } from '../shared/quiz';
import { StartedQuiz, ActiveStudent, Answer } from '../../subjects/shared/subject';
import { MyUser, UserService } from '../../shared/user.service';

import { first, take } from 'rxjs/operators';

@Injectable()
export class QuizService {

  private basePath = '/quizzes';
  quizzesRef: AngularFireList<StartedQuiz>;
  quizRef:  AngularFireObject<StartedQuiz>;

  users: AngularFireList<MyUser>;
  userName: string;
  userKey: string;

  constructor(private db: AngularFireDatabase, public auth: AuthService,
    public userService: UserService) {
    this.quizzesRef = db.list(this.basePath);

    this.users = db.list("/users");

    /*
    this.users = db.list("/users", {query: {
      orderByChild: 'uid',
      equalTo: userId$
    }}).subscribe();
    */  
   
    // reset user-a ukoliko je krivi:
    auth.user.subscribe(authData => {
      if (authData != null) {
        // get info by the displayname
        if (authData.displayName != undefined) {
          //console.log("REFRESHED");
          this.userName = authData.displayName;
          this.userKey = authData.key || '';
          // var user = userService.getUserByDisplayName(authData.displayName);
          // od tog usera, dohvatiti sve podatke:
        }
        //console.log(authData);
        auth.currentUser = auth.mapToMyUser(authData);
        //console.log(auth.currentUser);
      }
    });

    // find all quizzes that are in the [] - filtering
    /*
    auth.user.filter((x) => { return x.displayName == "viva"}).subscribe(authData => {
      if (authData != null) {
        console.log(authData);
      }
    });
    */
  }


  // Return an observable list of Quizzes
  getQuizzesList(): Observable<Quiz[]> {
    return this.quizzesRef.snapshotChanges().map((arr) => {
      return arr.map((snap) => Object.assign(snap.payload.val(), { $key: snap.key }) );
    });
  }


  quizzes: Observable<Quiz[]>;

   // Return an observable list of Quizzes
   getQuizzesListByKey(): Observable<Quiz[]> {
    var ref = this.db.database.ref("/quizzes");
    ref.orderByChild("secondsPerQuestion").equalTo(10).on("child_changed", function(snapshot) {
      if (snapshot != undefined)
        console.log(snapshot.key);
    });

    /*
    return this.db.list('/Groups', {
      query:{
        orderByChild: 'namelower',
        startAt: (ev.target.value),
        endAt: (ev.target.value + '\uf8ff')
      }
     }
    ).valueChanges();
    */

    //TODO - Observable<{}[]> cant be converted to Observable<Quiz[]>
    this.db.list('/quizzes', ref => {
      //ref.limitToFirst(2).orderByKey(true);
      let q = ref.orderByChild("secondsPerQuestion").equalTo(10);
      return q;
     }
    ).valueChanges();

    /*
    ref.orderByChild("secondsPerQuestion").equalTo(20).on("child_changed", function(snapshot) {
      if (snapshot != undefined)
        console.log(snapshot.key);
        return snapshot.map((snap) => Object.assign(snap.payload.val(), { $key: snap.key }) 
    });
    */

    return this.quizzesRef.snapshotChanges().map((arr) => {
      return arr.map((snap) => Object.assign(snap.payload.val(), { $key: snap.key }) );
    });
  }

  // Return a single observable item
  getQuiz(key: string): Observable<Quiz | null> {
    const quizPath = `${this.basePath}/${key}`;
    const quiz = this.db.object(quizPath).valueChanges() as Observable<Quiz | null>;
    return quiz;
  }

  // Return a single observable item
  getResults(classKey: string, quizKey: string): Observable<QuestionResult[] | null> {
    const questionResults = `classrooms/${classKey}/quizzes/${quizKey}/questions`;
    const results = this.db.object(questionResults).valueChanges() as Observable<QuestionResult[] | null>;
    return results;
  }

  // Return a single observable item
  getStartedQuiz(key: string): Observable<StartedQuiz | null> {
    const quizPath = `${this.basePath}/${key}`;
    const quiz = this.db.object(quizPath).valueChanges() as Observable<StartedQuiz | null>;
    return quiz;
  }

  // Default error handling for all actions
  private handleError(error: Error) {
    console.error(error);
  }














  // Update an exisiting item
  addStudentToQuiz(quiz: any, student: ActiveStudent): ActiveStudent {
    student.index = -1;
    //console.log(student);
    
    // transaction:
    this.db.database.refFromURL(`https://smartup-1234.firebaseio.com/quizzes/${quiz.$key}/activeStudents`)
      .ref.ref.transaction(activeStudents => {
        if (activeStudents == undefined) {
          activeStudents = [];
        }

        // check if the student already exists:
        activeStudents.forEach((elem: ActiveStudent, index: number) => {
          if (elem.name == student.name) {
            student.index = index;
            student.key = elem.key;
            student.name = elem.name;
            student.points = elem.points;
            student.started = elem.started;
          }
        });
        // console.log(student);
        // ako ima index, onda student postoji:
        if (student.index != -1)
          return activeStudents;

        student.index = activeStudents.length;
        activeStudents.push(student);
        return activeStudents;
      });

    return student;
  }

  // TODO - funkcija za pokretanje ispita za tog studenta:
  

  // Update an exisiting item
  // TODO - treba vratiti TRUE, i vratiti ACTIVESTUDENTS u bazu
  markQuizStartedForStudent(value: any, student: ActiveStudent, isStarted: boolean): boolean {
    // transaction:
    this.db.database.refFromURL(`https://smartup-1234.firebaseio.com/quizzes/${value.$key}/activeStudents`)
      .ref.ref.transaction(activeStudents => {
        // find student and change "started" to true:
        if (activeStudents == null) {
          return false;
        }
        activeStudents[student.index].started = isStarted;
        return activeStudents;
    });
    return isStarted;
  }


  // Add points to Quiz and Student - returns all points on current quiz!
  addPointsToStudent(quiz: any, student: ActiveStudent, currentStudent: any, addPoints: number): number {
    // add 1-2 points, depending on the speed
    var allPoints = 0;

    // transaction - student points on quiz:
    this.db.database.refFromURL(`https://smartup-1234.firebaseio.com/quizzes/${quiz.$key}/activeStudents`)
      .ref.ref.transaction(activeStudents => {
        // find student and add a point:
        activeStudents[student.index].points += addPoints;
        allPoints = activeStudents[student.index].points;
        return activeStudents;
    });

    currentStudent.$key = currentStudent.key;
    // transaction - adding points to student score:
    this.db.database.refFromURL(`https://smartup-1234.firebaseio.com/users/${currentStudent.$key}/points`)
      .ref.ref.transaction(points => {
        if (points == null) {
          points = addPoints;
        } else {
          points += addPoints;
        }
        return points;
    });

    // add the points to the user in classroom:
    this.db.database.refFromURL(`https://smartup-1234.firebaseio.com/classrooms/${quiz.classroomKey}/students`)
      .ref.ref.transaction(students => {
        if (students == undefined) {
          students = [];
        }

        // find student with that name (key), and add points:
        for (var i = 0; i < students.length; i++) {
          if (students[i].key == currentStudent.key) {
            // add points and return
            if (students[i].points == null) {
              students[i].points = 0;
            }
            students[i].points += addPoints;
            break;
          }
        }

        return students;
      });

    return allPoints;
  }


  // Add points to Quiz and Student - returns all points on current quiz!
  addFinishedQuizToStudent(currentQuiz: any, student: ActiveStudent, currentPoints: number) {
    // transaction - adding quiz result to the student:

    var date = new Date();
    var currentDate = this.addPadding(date.getDate()) + "." + this.addPadding(date.getMonth() + 1) 
        + "." + date.getFullYear() + ".";

    // quizKey from classroom
    this.db.database.refFromURL(`https://smartup-1234.firebaseio.com/users/${student.key}/quizzes/${currentQuiz.subjectName}`)
    .ref.ref.transaction(finishedQuizzes => {
      if (finishedQuizzes == null) {
        finishedQuizzes = [];
      }

      var quiz = new FinishedQuizResult();
      quiz.numberOfQuestions = currentQuiz.quiz.questions.length || 0;
      quiz.quizName = currentQuiz.quiz.name;
      quiz.timestamp = date.toLocaleString();
      quiz.points = currentPoints;
      quiz.date = currentDate;
      quiz.key = currentQuiz.$key;

      finishedQuizzes.push(quiz);
      return finishedQuizzes;
     });

     this.db.database.refFromURL(`https://smartup-1234.firebaseio.com/users/${student.key}/pointsDaily`)
    .ref.ref.transaction(pointsDaily => {
      // list of points each day:
      if (pointsDaily == null) {
        pointsDaily = [];
      }

      var added = false;
      // check if that day exists, if not, add 0 and ++
      for (var i = 0; i < pointsDaily.length; i++) {
        if (pointsDaily[i].date == currentDate) {
          // add points to this date:
          pointsDaily[i].points += currentPoints;
          added = true;
        }
      }

      if (!added) {
        var points = {
          date: currentDate,
          points: currentPoints
        }
        pointsDaily.push(points);
      }

      return pointsDaily;
     });

    /*
    // quizKey from classroom
    this.db.database.refFromURL(`https://smartup-1234.firebaseio.com/users/${student.key}/quizzes/${currentQuiz.subjectName}/${currentDate}/${currentQuiz.$key}`)
      .ref.ref.transaction(finishedQuiz => {
        if (finishedQuiz) {
          finishedQuiz = new FinishedQuizResult();
        }

        var quiz = new FinishedQuizResult();
        quiz.numberOfQuestions = currentQuiz.quiz.questions.length || 0;
        quiz.quizName = currentQuiz.quiz.name;
        quiz.timestamp = date.toLocaleString();
        quiz.points = currentPoints;

        finishedQuiz = quiz;
        return finishedQuiz;
    });
    */

  }


  // add padding to date:
  addPadding(num: number): string {
    if (num < 10) {
      return "0" + num;
    }
    return '' + num;
  }




















  /*****
   * addAnswer - to classroom
   * addQuizToClassroom = made by prof
   * 
   */



  // Add answer to Classroom Quizzes:
  // dodati odgovor, i ukoliko je točan, dodati i bodove
  // currentQuiz, currentUser (zbog ničega?), currentQuestionNumber
  addAnswer(currentQuiz: any, student: ActiveStudent, currentUser: any,
    currentQuestionNumber: number, selectedAnswer: Answer, answerTime: number): void {
    // ako kviz ne postoji, zapisati kviz, dodati pitanje, ako ne postoji i odgovor studenta
    // dodati kviz u classroom = kviz - pitanje - student/odgovor/vrijeme (+ tip i datum, npr)
    var classroomKey = currentQuiz.classroomKey;

    var points = 0;
    /*
    this.db.database.refFromURL(`https://smartup-1234.firebaseio.com/classrooms/${classroomKey}/quizzes`)
    .ref.ref.transaction(quizzes => {
      // naći quiz koji nam treba:

      if (quizzes == null) {
        quizzes = [];
      }

      console.log(quizzes);

      // find existing quiz:
      var givenAnswers;
      var index = -1;
      for (var i = 0; i < quizzes.length; i++) {
        if (quizzes[i].key == currentQuiz.$key) {
          console.log("NAĐEN + " + i);
          index = i;
          givenAnswers = quizzes[i].questions[currentQuestionNumber].givenAnswers;
        }
      }

      // questions/${currentQuestionNumber}/givenAnswers

      if (quizzes[index].questions[currentQuestionNumber].givenAnswers == null) {
        quizzes[index].questions[currentQuestionNumber].givenAnswers = [];
      }
      var answer = new AnswerResult();
      answer = {
        student: student.name,
        answer: selectedAnswer.text,
        correct: selectedAnswer.correct,
        time: answerTime
      }

      if (selectedAnswer.correct) {
        points = 1;
        if (currentQuiz.isSynced) {
          var firstCorrect = true;
          for (var i = 0; i < givenAnswers.length; i++) {
            if (givenAnswers[i].correct) {
              firstCorrect = false;
              break;
            }
          }
          if (firstCorrect) {
            points++;
          }
        }
      }

      // givenAnswers.push(answer);
      if (index != -1) {
        quizzes[index].questions[currentQuestionNumber].givenAnswers.push(answer);
      }
      return quizzes;
    });
    */

    // removed key of quiz
    // instead of currentQuiz.$key - quiz array no
    this.db.database.refFromURL(`https://smartup-1234.firebaseio.com/classrooms/${classroomKey}/quizzes/${currentQuiz.classArrayNo}/questions/${currentQuestionNumber}/givenAnswers`)
      .ref.ref.transaction(givenAnswers => {
        if (givenAnswers == null) {
          givenAnswers = [];
        }
        var answer = new AnswerResult();
        answer = {
          student: student.name,
          answer: selectedAnswer.text,
          correct: selectedAnswer.correct,
          time: answerTime
        }

        if (selectedAnswer.correct) {
          points = 1;
          if (currentQuiz.isSynced) {
            var firstCorrect = true;
            for (var i = 0; i < givenAnswers.length; i++) {
              if (givenAnswers[i].correct) {
                firstCorrect = false;
                break;
              }
            }
            if (firstCorrect) {
              points++;
            }
          }
        }

        givenAnswers.push(answer);
        return givenAnswers;
      });

      if (points != 0) {
        this.addPointsToStudent(currentQuiz, student, currentUser, points);
      }     
  }
  

  /************ called from exam service **************/

  // returns array index of quiz in class:
  addQuizToClassroom(currentQuiz: StartedQuiz, quizKey: string): number {
    var classArrayNo = -1;

    this.db.database.refFromURL(`https://smartup-1234.firebaseio.com/classrooms/${currentQuiz.classroomKey}/quizzes`)
    .ref.ref.transaction(quizzes => {
      if (quizzes == null) {
        quizzes = [];
      }

      var quiz = new QuizResultPrepare();
      quiz.key = quizKey;
      quiz.quizName = currentQuiz.quiz.name;
      quiz.isSynced = currentQuiz.isSynced;
      quiz.openUntil = currentQuiz.openUntil || '';
      quiz.secondsPerQuestion = currentQuiz.secondsPerQuestion;

      // TODO - write all the questions:
      if (quiz.questions == undefined) {
        quiz.questions = [];
      }
      // maybe push each one??
      for (var i = 0; i < currentQuiz.quiz.questions.length; i++) {
        quiz.questions.push(new QuestionResult());
        quiz.questions[i].text = currentQuiz.quiz.questions[i].text;
      }

      console.log("VRATITI OVO:");
      console.log(quizzes.length);
      classArrayNo = quizzes.length;
      quizzes.push(quiz);
      return quizzes;
  });
  return classArrayNo;

    /* 
    // OLD - with $key in path:
    this.db.database.refFromURL(`https://smartup-1234.firebaseio.com/classrooms/${currentQuiz.classroomKey}/quizzes/${quizKey}`)
      .ref.ref.transaction(quiz => {
        quiz = new QuizResult();
        quiz.quizName = currentQuiz.quiz.name;
        quiz.isSynced = currentQuiz.isSynced;
        quiz.openUntil = currentQuiz.openUntil;
        quiz.secondsPerQuestion = currentQuiz.secondsPerQuestion;

        // TODO - write all the questions:
        if (quiz.questions == undefined) {
          quiz.questions = [];
        }
        // maybe push each one??
        for (var i = 0; i < currentQuiz.quiz.questions.length; i++) {
          quiz.questions.push(new QuestionResult());
          quiz.questions[i].text = currentQuiz.quiz.questions[i].text;
        }

        return quiz;
    });
    */
  }
}



// quiz added to classroom:
export class QuizResultPrepare {
  key?: string;
  quizName: string;
  isSynced: boolean;
  openUntil: string;
  secondsPerQuestion: number;
  questions: QuestionResult[];
}



// rezultati kviza
export class QuizResult {
  quizName: string;
  questions: QuestionResult[];
}

export class QuestionResult {
  text: string;
  //rightAnswer: string;
  givenAnswers: AnswerResult[];
}

export class AnswerResult {
  student: string;
  answer: string;
  correct: boolean;
  time: number;
}

// finished exam:
export class FinishedQuizResult {
  quizName: string;
  points: number;
  numberOfQuestions: number;
  timestamp: string;

  date: string;
  key: string;
}
