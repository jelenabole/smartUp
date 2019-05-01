import { Component, OnInit } from '@angular/core';

import { ExerciseService } from '../exercise.service';
import { Exercise } from '../exercise';
import { Observable } from 'rxjs/Observable';
import { StartedQuiz, Question, Answer } from '../../../professor/subjects/subject';
import { AuthService } from '../../../core/auth.service';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'exercises-list',
  templateUrl: './exercises-list.component.html',
  styleUrls: ['./exercises-list.component.scss'],
})
export class ExercisesListComponent implements OnInit {

  // search text:
  searchText: string;

  exercises: Observable<Exercise[]>;
  showSpinner = true;

  // for modal window:
  showQuiz = true; // why true !?!?
  tutorial = false; // show the instructions

  // da li je kviz počeo, te otvaranje detalja:
  ifQuizSelected = false; // prepare "full screen"
  showDetails = false; // begining screen
  showQuestions = false; // question screen
  blackScreen = false; // black screen
  showResults = false; // end screen for quiz
  
  selectedExercise: StartedQuiz;

  currentQuestion: Question;
  currentQuestionNumber: number = 0;
  selectedAnswer: Answer;
  currentPoints: number = 0;
  progress = 0;

  constructor(private auth: AuthService, private exerciseService: ExerciseService,
    private appComponent: AppComponent) {
    this.exercises = this.exerciseService.getExercisesList();
    this.currentPoints = 0;
  }

  ngOnInit() {
    this.exercises.subscribe((x) => {
      this.showSpinner = false;
    });
  }


  /**** buttons functions *****/


  search() {
    console.log("search - not impl");
    // TODO - search for new exercises
    // ... napraviti filter umjesto searcha
  }

  startDetails(quiz: StartedQuiz) {
    // XXX - remove menu:
    console.log("prepare quiz - details");
    this.appComponent.triggerMenu();
    this.selectedExercise = quiz;

    this.ifQuizSelected = true;
    this.showDetails = true;
  }

  // not used:
  hideQuizAll() {
    this.ifQuizSelected = false;
    this.showDetails = false;
    this.showQuestions = false;
    this.blackScreen = false;
    this.showResults = false;
  }




  startQuiz() {
    console.log("quiz should start now");
  //postavila na auth varijablu za skrivanje svega ostaloga..
    // dole otvoriti formu za pokretanje ispita = učitati sva pitanja...
    this.currentQuestion = this.selectedExercise.quiz.questions[0];
    this.showDetails = false;
    this.blackScreen = false; // maybe needed for synced
    this.showQuestions = true;
    this.progress = 0;

    // start with the questions:
    this.currentQuestionNumber = -1;
    this.moveToNextQuestion();
  }

  // selecting the answer (on check click)
  setAnswer(answer: Answer) {
    this.selectedAnswer = answer;
  }

  // stop the clock if quiz is not synced, add black screen and points
  checkAnswer() {
    this.stopClock = true;
    this.blackScreen = true;

    // add points for correct answer:
    if (this.selectedAnswer.correct) {
      this.currentPoints++;
    }
    //this.selectedAnswer = new Answer();
    // in both cases = move to next question:
    // move is done through the clock - no need here
    //this.moveToNextQuestion();
  }



















  // called from a clock?
  moveToNextQuestion() {
    //console.log("move to next question");
    // check which question was that:
    this.stopClock = false;
    this.selectedAnswer = new Answer();
    this.currentQuestionNumber++;
    this.blackScreen = false;
    this.progress = this.currentQuestionNumber / this.selectedExercise.quiz.questions.length * 100;

     // prvojerit da li je to zadnje pitanje:
    if (this.selectedExercise.quiz.questions.length > this.currentQuestionNumber) {
      this.currentQuestion = this.selectedExercise.quiz.questions[this.currentQuestionNumber];
      this.startClock(this.selectedExercise.secondsPerQuestion);
    } else {  
      this.calculateResult();
    }
  }

  calculateResult() {
    this.showQuestions = false;
    this.showResults = true;
  }

  stopQuiz() {
    this.appComponent.triggerMenu();
    
    this.selectedExercise = new StartedQuiz();
    this.ifQuizSelected = false;
    this.showResults = false;
    this.stopClock = true;
    this.currentPoints = 0;

    this.showDetails = false;
    this.showQuestions = false;
    this.progress = 0;
  }


  /******* CLOCK *********/

  stopClock = false;
  remaining = 0;
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

      if (self.remaining <= 0 || self.stopClock){
        // crni ekran 
        self.blackScreen = true;
        // TODO - zbrojiti vrijeme učenika:
        self.answerTimeLeft = self.remaining + (mili / 10);
        //console.log("preostalo vrijeme: " + self.answerTimeLeft);
        console.log("vrijeme odgovaranja: " + (seconds - self.answerTimeLeft));
        // za dvije sekunde novo pitanje
        setTimeout(() => {self.moveToNextQuestion()}, 1500);
        clearInterval(timeinterval);
      }

      if (mili == 0) {
        mili = 10;
      }
    }, 100);
  }





  /*************** SHUFFLE ***************/



   // additional function for shuffling the questions and answers:
   shuffleQuestions (array: any) {
    var copy = Object.assign([], array);
    var another: Question[] = [];
    var m = array.length, i;
    var index = 0;

    // While there remain elements to shuffle
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
      another.push(copy[i]);
      another[index].answers = this.shuffleAnswers(another[index].answers);
      index++;
      copy.splice(i, 1);
    }
    return another;
  }
  shuffleAnswers (array: any) {
    var copy = Object.assign([], array);
    var another: Answer[] = [];
    var m = array.length, i;

    while (m) {
      i = Math.floor(Math.random() * m--);
      another.push(copy[i]);
      copy.splice(i, 1);
    }
    return another;
  }

}
