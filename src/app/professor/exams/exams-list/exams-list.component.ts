import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { StartedQuiz, Quiz, Question, Answer, Subject } from '../../subjects/subject';
import { AuthService } from '../../../core/auth.service';
import { Exam } from '../exam';
import { ExamService } from '../exam.service';
import { ClassroomService } from '../../classrooms/classroom.service';
import { SubjectService } from '../../subjects/subject.service';
import { Classroom } from '../../classrooms/classroom';

@Component({
  selector: 'exams-list',
  templateUrl: './exams-list.component.html',
  styleUrls: ['./exams-list.component.scss'],
})
export class ExamsListComponent implements OnInit {
  // nije potrebno? ?
  showStartQuizForm = true;

  showSpinner = true;
  exams: Observable<Exam[]>;

  // pregled trenuntog
  exam: Observable<StartedQuiz | null>;
  currentExamKey: string;

  classrooms: Observable<Classroom[]>;
  subjects: Observable<Subject[]>;

  selectedClassroom: Classroom;
  selectedSubject: Subject;
  selectedQuiz: Quiz;
  synced: true;

  // TODO - test variables:
  pickSubject: Subject;
  pickQuiz: Quiz;
  pickClassroom: Classroom;
  // for the started quiz:
  selectedStartQuiz: StartedQuiz;

  // for modal window:
  tutorial = false; // show the instructions

  // da li je kviz počeo, te otvaranje detalja:
  showResults = false; // end screen for quiz
  
  selectedExam: StartedQuiz;

  constructor(private auth: AuthService, private examService: ExamService,
    private classroomService: ClassroomService, private subjectService: SubjectService) {
    this.exams = this.examService.getExamsList();

    this.reset();
    this.subjects = this.subjectService.getSubjectsList();
    this.classrooms = this.classroomService.getClassroomsList();

    // for the selects:
    this.pickSubject = new Subject();
    this.pickSubject.name = "- Odaberi predmet -";
    this.pickSubject.active = false;
    this.pickQuiz = new Quiz();
    this.pickQuiz.name = "- Odaberi kviz -";
    this.pickClassroom = new Classroom();
    this.pickClassroom.name = "- Odaberi razred -";
    this.pickClassroom.active = false;
  }

  test() {
    console.log("list");
    console.log(this.exams);
  }

  ngOnInit() {
    this.exams.subscribe((x) => {
      this.showSpinner = false;
    });
  }


  /**** buttons functions *****/
  // XXX - StartedQuiz
  checkStatus(exam: any) {
    console.log(exam);
    this.exam = this.examService.getStartedExam(exam.$key);
    this.currentExamKey = exam.$key;
    this.showResults = true;
  }

  startExam(exam: any) {
    this.selectedStartQuiz = JSON.parse(JSON.stringify(exam));
    this.selectedStartQuiz.isStarted = true;

    // obriši sve učenike koji nisu aktivni:
    if (this.selectedStartQuiz.activeStudents != undefined) {
      for (var i = 0; i < this.selectedStartQuiz.activeStudents.length; i++) {
        if (!this.selectedStartQuiz.activeStudents[i].started) {
          this.selectedStartQuiz.activeStudents.splice(i, 1);
          i--;
        }
      }
    }

    this.examService.updateExam(this.currentExamKey, this.selectedStartQuiz);
    this.selectedStartQuiz = new StartedQuiz();
  }

  deleteQuiz() {
    console.log("start delete");
    if (this.currentExamKey != undefined && this.currentExamKey != "") {
      console.log("deleting");
      this.examService.deleteQuiz(this.currentExamKey);
    }
    this.currentExamKey = "";
    this.returnToList();
  }

  deleteStudent(index: number) {
    this.examService.deleteStudentFromQuiz(this.currentExamKey, index);
  }

  returnToList() {
    this.showResults = false;
    this.exam = new Observable<null>();
  }

  





  /******** Schedule quiz **********/

  checkFields(): boolean {
    if (this.selectedQuiz == this.pickQuiz) {
      return false;
    }
    if (this.selectedClassroom == this.pickClassroom) {
      return false;
    }
    if (this.selectedSubject == this.pickSubject) {
      return false;
    }
      
    return true;
  }

  prepareQuiz() {
    if (!this.checkFields()) {
      return;
    }
    // XXX - classroom nije potreban:
    //this.selectedStartQuiz.classroom = this.selectedClassroom;

    this.selectedStartQuiz.quiz = this.selectedQuiz;
    this.selectedStartQuiz.classroomName = this.selectedClassroom.name;
    this.selectedStartQuiz.classroomKey = this.selectedClassroom.$key;
    this.selectedStartQuiz.subjectName = this.selectedSubject.name;
    this.selectedStartQuiz.subjectKey = this.selectedSubject.$key;

    // console.log(this.auth.currentUser.displayName);
    this.selectedStartQuiz.professorName = this.auth.currentUser.displayName;

    // add all students to the quiz:
    if (this.selectedClassroom.students != undefined) {
      for (var i = 0; i < this.selectedClassroom.students.length; i++) {
        this.selectedStartQuiz.activeStudents[i] = {
          index: i,
          key: this.selectedClassroom.students[i].key,
          name: this.selectedClassroom.students[i].name,
          points: 0,
          started: false
        };
      }
    }

    // TODO - shuffle the questions:
    this.selectedStartQuiz.quiz.questions = this.shuffleQuestions(this.selectedStartQuiz.quiz.questions);

    // TODO - re-route user to the quiz page
    this.examService.createQuiz(this.selectedStartQuiz);
    this.closeModalStartQuiz();
  }










  /**** modal *********/
  openModalToStartQuiz() {
    //default values:
    this.selectedSubject = this.pickSubject;
    this.selectedQuiz = this.pickQuiz;
    this.selectedClassroom = this.pickClassroom;
    this.selectedStartQuiz.openUntil = this.getEndTimestamp();

    this.open("modalStartQuiz");
  }

  // format datuma: dd.mm.yyyy. HH:mm
  // XXX - add 2 days and trump minutes
  getEndTimestamp(): string {
    var date = new Date();
    date.setMinutes(0);
    date.setDate(date.getDate() + 2);

    var temp = "";
    temp += date.toLocaleDateString().replace(/\s/g, "");
    temp += " " + date.toLocaleTimeString().substring(0, 5);

    return temp;
  }

  open(elementId: string) {
    console.log("opened")
    var modal = null;
    if ((modal = document.getElementById(elementId)) != null) {
      modal.className += " is-active";
    }
  }

  closeModalStartQuiz() {
    this.close("modalStartQuiz");
  }

  close(elementId: string) {
    this.reset();
    var modal = null;
    if ((modal = document.getElementById(elementId)) != null) {
      modal.className = "modal";
    }
  }
  // reset classes:
  reset() {
    this.selectedSubject = new Subject;
    this.selectedQuiz = new Quiz;
    this.selectedClassroom = new Classroom;
    // TODO - add subjects from professors (all false):
    // this.selectedQuiz.subjects = JSON.parse(JSON.stringify(this.allSubjects));

    // this doesnt be reset ?? just start it from the begining
    this.selectedStartQuiz = new StartedQuiz();
  }













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
