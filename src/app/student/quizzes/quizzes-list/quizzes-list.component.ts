import { Component, OnInit } from '@angular/core';
import { QuizService, QuestionResult } from '../quiz.service';
import { Quiz } from '../quiz';
import { Observable } from 'rxjs/Observable';
import { StartedQuiz, Question, Answer, ActiveStudent } from '../../../professor/subjects/subject';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../../core/auth.service';
import { AppComponent } from '../../../app.component';
import { ClassroomService } from '../../../professor/classrooms/classroom.service';

@Component({
  selector: 'quizzes-list',
  templateUrl: './quizzes-list.component.html',
  styleUrls: ['./quizzes-list.component.scss'],
})
export class QuizzesListComponent implements OnInit {

  quizzes: Observable<Quiz[]>;
  quiz: Observable<StartedQuiz | null>;
  results: Observable<QuestionResult[] | null>;

  showSpinner = true;
  classroomCode: string;

  // for modal window:
  showQuiz = true; // why true !?!?
  tutorial = false; // show the instructions

  // da li je kviz počeo, te otvaranje detalja:
  ifQuizSelected = false; // prepare "full screen"
  showDetails = false; // begining screen
  showDetailsStartButton = false; // button for start
  showQuestions = false; // question screen
  blackScreen = false; // black screen
  showResults = false; // end screen for quiz
  isCounting = false;

  // synced quiz:
  showQuestionsSynced = false;
  
  student: ActiveStudent;
  currentPoints: number = 0;
  studentNumber: number; // student array number for updates

  selectedQuiz: StartedQuiz;
  currentQuestion: Question;
  currentQuestionNumber: number = 0;
  selectedAnswer: Answer;
  answerTime: number;

  timeBetweenQuestions = 1.5;
  timeBetweenQuestionsSynced = 3;

  progress = 0;
  subscribed: Subscription;
  numberOfStudentsOnQuiz: number;
 

  constructor(private auth: AuthService, private quizService: QuizService,
    private classroomService: ClassroomService, private appComponent: AppComponent) {

    this.quizzes = this.quizService.getQuizzesList();
    // console.log(this.quizzes);
    this.student = new ActiveStudent();
    this.student.name = quizService.userName;
    this.student.key = quizService.userKey;
    this.student.points = 0;
  }

  ngOnInit() {
    this.quizzes.subscribe((x) => {
      this.showSpinner = false;
    });
  }

  addClassroom() {
    // XXX - add classroom by code, instead of QR code
    var found = false;

    if (this.auth.currentUser.key != undefined && this.classroomCode && this.classroomCode.length) {
      console.log("razred dodan");
      this.classroomService.addStudentToClassroom(this.classroomCode,
        this.auth.currentUser.key, this.auth.currentUser.displayName);
        this.classroomCode = "";
    }
  }















  /**** buttons functions *****/
  resetStudent() {
    this.student.index = -1;
    this.student.points = 0;
    this.student.started = false;
  }

  // 1. korak
  startDetails(quiz: any) {
    console.log("prepare quiz - details");
    //console.log(quiz);

    // refresh korisnika - maknut meni:
    this.resetStudent();
    this.student.name = this.quizService.userName;
    this.student.key = this.quizService.userKey;
    this.appComponent.triggerMenu();

    console.log(quiz);
    // dohvati observable po ključu, i selectaj kviz:
    this.selectedQuiz = quiz;
    this.quiz = this.quizService.getStartedQuiz(quiz.$key);

    // if its synced - observe the results for the 
    if (this.selectedQuiz.isSynced && this.selectedQuiz.classroomKey && quiz.$key) {
      this.results = this.quizService.getResults(this.selectedQuiz.classroomKey, quiz.$key);
    }
    
    //console.log(this.selectedQuiz);
    // add student to quiz
    this.student = this.quizService.addStudentToQuiz(this.selectedQuiz, this.student);

    // XXX - ako nije riješio ispit, prikazati gumb (i ako nije sync)
    if (!this.student.started) {
      this.showDetailsStartButton = true;
    }

    this.ifQuizSelected = true;
    this.showDetails = true;
    this.currentQuestionNumber = -1;

    // if synced, mark quiz as started for student
    // XXX - if its synced - hide the START button, also, wait for 3 seconds after start
    // XXX - if the quiz is synced and didnt yet start ... wait for the start:
    if (this.selectedQuiz.isSynced && !this.selectedQuiz.isStarted) {
      this.student.started = this.quizService.markQuizStartedForStudent(this.selectedQuiz, this.student, true);
      //this.selectedQuiz.isStarted = true;

      this.subscribed = this.quiz.subscribe(data => {
        if (data != null) {
          if (data.isStarted) {
            // XXX - start the quiz (3 secs)
            this.countdown(this.timeBetweenQuestionsSynced); // 3, 2, 1...
            this.selectedQuiz.isStarted = true;
            this.numberOfStudentsOnQuiz = data.activeStudents.length;
            this.subscribed.unsubscribe();
          }
        }
      });
    }
  }

  hideQuizAll() {
    this.ifQuizSelected = false;
    this.showDetails = false;
    this.showQuestions = false;
    this.blackScreen = false;
    this.showResults = false;
  }

















  /*********** QUIZ - without sync **************/

  // 2. korak
  startQuiz() {
    // mark quiz as "started"
    this.student.started = this.quizService.markQuizStartedForStudent(this.selectedQuiz, this.student, true);
    // XXX - za sada ne zapisivati da je kviz započet
    //this.student.started = true;
    console.log("quiz should start now");

    // TODO - postavila na auth varijablu za skrivanje svega ostaloga..
    this.currentQuestion = this.selectedQuiz.quiz.questions[0];
    this.showDetails = false;
    this.blackScreen = false; // maybe needed for synced
    this.showQuestions = true;
    this.progress = 0;

    // start with the questions:
    this.currentQuestionNumber = -1;
    this.moveToNextQuestion();

    // TODO - progress bar, with the number of questions
  }

  // selecting the answer (on check click)
  setAnswer(answer: Answer) {
    this.selectedAnswer = answer;
  }

  // stop the clock if quiz is not synced, add black screen and points
  checkAnswer() {
    if (!this.selectedQuiz.isSynced) {
      this.stopClock = true;
    }
    this.blackScreen = true;

    // add points for correct answer:
    if (this.selectedAnswer.correct) {
      this.currentPoints++;
      // points added, after adding answer (to know which is first)
      //this.quizService.addPointsToStudent(this.selectedQuiz, this.student, this.auth.currentUser);
    }

    this.quizService.addAnswer(this.selectedQuiz, this.student, this.auth.currentUser,
      this.currentQuestionNumber, this.selectedAnswer, this.answerTime);
    // this.selectedAnswer = new Answer();
    // in both cases = move to next question:
    // move is done through the clock - no need here
    // this.moveToNextQuestion();
  }

  // called from a clock?
  // 4. korak
  moveToNextQuestion() {
    // console.log("move to next question");
    // check which question was that:
    this.stopClock = false;
    this.selectedAnswer = new Answer();
    this.currentQuestionNumber++;
    this.blackScreen = false;
    this.progress = this.currentQuestionNumber / this.selectedQuiz.quiz.questions.length * 100;

    // prvojerit da li je to zadnje pitanje:
    if (this.selectedQuiz.quiz.questions.length > this.currentQuestionNumber) {
      this.currentQuestion = this.selectedQuiz.quiz.questions[this.currentQuestionNumber];
      this.startClock(this.selectedQuiz.secondsPerQuestion);
    } else {
      this.calculateResult();
    }
  }

  calculateResult() {
    this.quizService.addFinishedQuizToStudent(this.selectedQuiz, this.student, this.currentPoints);
    this.showQuestions = false;
    this.showResults = true;
  }

  // if its stopped in the middle, also add points:
  stopQuizMiddle() {
    this.quizService.addFinishedQuizToStudent(this.selectedQuiz, this.student, this.currentPoints);
    this.stopQuiz();
  }

  // 5. korak (from question screen)
  stopQuiz() {
    this.appComponent.triggerMenu();

    // remove student and unsubscribe:
    // remove studnet only if quiz havent started:
    if (this.selectedQuiz.isSynced) {
      if (this.subscribed != undefined) {
        this.subscribed.unsubscribe();
      }
      if (!this.selectedQuiz.isStarted) {
        this.student.started = this.quizService.markQuizStartedForStudent(this.selectedQuiz, this.student, false);
      }
    }
    
    //console.log("stop !");
    this.selectedQuiz = new StartedQuiz();
    // XXX - zaustaviti sat, ali bez prikaza rezultata T/F (ako je zaustavljen)
    this.ifQuizSelected = false;
    this.stopClock = true;
    this.showResults = false;
    this.currentPoints = 0;

    // progress:
    this.progress = 0;

    // additional - needed?
    this.showDetails = false;
    this.showDetailsStartButton = false;
    this.showQuestions = false;
  }














   /*********** QUIZ - with sync **************/

  // 2. korak
  startQuizSynced() {
    console.log("quiz should start now");

    // check all student answers:
    this.subscribed = this.results.subscribe(data => {
      if (data != null) {
        // if all students answered, skip to next question:
        if (data[this.currentQuestionNumber].givenAnswers) {
          if (this.numberOfStudentsOnQuiz <= data[this.currentQuestionNumber].givenAnswers.length) {
            // console.log(data[this.currentQuestionNumber].givenAnswers.length);
            // console.log("STOP CLOCK");
            this.stopClock = true;
          }
        }
      }
    });

    // TODO - postavila na auth varijablu za skrivanje svega ostaloga..
    this.currentQuestion = this.selectedQuiz.quiz.questions[0];
    this.showDetails = false;
    this.showQuestions = true;
    this.progress = 0;

    // start with the questions:
    this.currentQuestionNumber = -1;
    this.moveToNextQuestionSynced();
  }

  // called from a clock?
  // 4. korak
  moveToNextQuestionSynced() {
    // console.log("move to next question");
    this.stopClock = false;
    this.selectedAnswer = new Answer();
    this.currentQuestionNumber++;
    this.progress = this.currentQuestionNumber / this.selectedQuiz.quiz.questions.length * 100;

    // TODO - countdown after finish:
    // startClock - Synced

    // prvojerit da li je to zadnje pitanje:
    if (this.selectedQuiz.quiz.questions.length > this.currentQuestionNumber) {
      this.currentQuestion = this.selectedQuiz.quiz.questions[this.currentQuestionNumber];
      this.startClockSynced(this.selectedQuiz.secondsPerQuestion);
    } else {
      this.calculateResult();
    }
  }

  // show black screen for few secs, then 
  checkAnswerSynced() {
    this.isCounting = true;

    // add points for correct answer:
    // XXX - maknuti ovo, i dohvaćati odmah iz odgovora:
    if (this.selectedAnswer.correct) {
      this.currentPoints++;
    }

    // TODO - dodaj odgovor, provjeri ga, i vrati broj bodova:
    this.quizService.addAnswer(this.selectedQuiz, this.student, this.auth.currentUser,
      this.currentQuestionNumber, this.selectedAnswer, this.answerTime);
  }

  // start clock for (x) number of seconds
  startClockSynced(seconds: number) {
    this.remaining = seconds;
    this.time = seconds * 10;
    var mili = 10;
    this.answerTimeLeft = seconds;
    // svaku sekundu mijenjati, ali češće provjeravati:

    var self = this;
    var timeinterval = setInterval(function(){
      mili--;
      if (mili == 0) {
        self.remaining--;
      }
      // calculate answerTime:
      self.answerTime = seconds - (self.remaining + (mili / 10));

      if (self.remaining <= 0 || self.stopClock){
        // provjeriti je li kviz još u tijeku:
        if (self.ifQuizSelected) {
          // crni ekran i vrijeme odgovaranja:
          //self.blackScreen = true;

          // ne postavljamo black screen, nego postavljamo countdown na par sekundi
          // zatim prelazimo na sljedeće pitanje
         
          self.answerTimeLeft = self.remaining + (mili / 10);
          self.answerTime = seconds - self.answerTimeLeft;

          // move to next question - in countdown:
          self.countdown(self.timeBetweenQuestionsSynced);
          
          // console.log("vrijeme odgovaranja: " + self.answerTime);
        }
        clearInterval(timeinterval);
      }

      if (mili == 0) {
        mili = 10;
      }
    }, 100);
  }


  // XXX - funkcija za brojanje 
  countdown(seconds: number) {
    // upali crni ekran, ispiši 3, 2, 1 (broj sekundi)
    // pokreni kviz iza toga
    this.blackScreen = false;
    this.isCounting = true;
    this.waiting = seconds;

    // svaku sekundu mijenjati, ali češće provjeravati:

    var self = this;
    var timeinterval = setInterval(function(){
      self.waiting--;

      if (self.waiting <= 0) {
        // pokreni kviz i makni crni ekran:
        console.log(self.currentQuestionNumber);
        if (self.currentQuestionNumber < 0) {
          self.startQuizSynced();
        } else {
          self.moveToNextQuestionSynced();
        }
        
        self.isCounting = false;
        clearInterval(timeinterval);
      }
    }, 1000);
  }













  /************** CLOCK ***************/




  stopClock = false;
  remaining = 0; // waiting for answers
  waiting = 0; // waiting between questions
  time = 0;
  answerTimeLeft: number = 0;

  


   // start clock for (x) number of seconds
   startClock(seconds: number) {
    this.remaining = seconds;
    this.time = seconds * 10;
    var mili = 10;
    this.answerTimeLeft = seconds;
    // svaku sekundu mijenjati, ali češće provjeravati:

    var self = this;
    var timeinterval = setInterval(function(){
      mili--;
      if (mili == 0) {
        self.remaining--;
      }
      // calculate answerTime:
      self.answerTime = seconds - (self.remaining + (mili / 10));

      if (self.remaining <= 0 || self.stopClock){
        // provjeriti je li kviz još u tijeku:
        if (self.ifQuizSelected) {
          // crni ekran i vrijeme odgovaranja:
          self.blackScreen = true;
         
          self.answerTimeLeft = self.remaining + (mili / 10);
          self.answerTime = seconds - self.answerTimeLeft;
          console.log("vrijeme odgovaranja: " + self.answerTime);
          
          // za dvije sekunde novo pitanje
          setTimeout(() => {self.moveToNextQuestion()}, self.timeBetweenQuestions * 1000);
        }
        clearInterval(timeinterval);
      }

      if (mili == 0) {
        mili = 10;
      }
    }, 100);
  }


}
