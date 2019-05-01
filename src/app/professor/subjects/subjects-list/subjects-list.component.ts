import { Component, OnInit } from '@angular/core';
import { SubjectService } from '../subject.service';
import { Subject, Quiz, Question, Answer, StartedQuiz } from '../subject';
import { Observable } from 'rxjs/Observable';
import { ClassroomService } from '../../classrooms/classroom.service';
import { Classroom } from '../../classrooms/classroom';


@Component({
  selector: 'subjects-list',
  templateUrl: './subjects-list.component.html',
  styleUrls: ['./subjects-list.component.scss'],
})
export class SubjectsListComponent implements OnInit {

  // TODO - catch classrooms from professor, and dont reset (they are the same):
  classrooms: Observable<Classroom[]>;
  subjects: Observable<Subject[]>;
  
  showSpinner = true;
  showForm = true;
  showSubjectForm = true;
  showStartQuizForm = true;
  tutorial = false; // add this tutorial to pages (messages)
  dirty = false;

  selectedClassroom: Classroom;
  selectedSubject: Subject;
  selectedQuiz: Quiz;

  // for the started quiz:
  selectedStartQuiz: StartedQuiz;

  // TODO - test variables:
  pickQuiz: Quiz;
  pickClassroom: Classroom;

  // TODO - boolean "showForms" are not used, check if it is needed
  // example, if the submit.click() would trigger both (for enter button)
  constructor(private subjectService: SubjectService, private classroomService: ClassroomService) {
    this.subjects = this.subjectService.getSubjectsList();
    this.classrooms = this.classroomService.getClassroomsList();
    this.reset();

    // for the selects:
    this.pickQuiz = new Quiz();
    this.pickQuiz.name = "- Odaberi kviz -";
    this.pickClassroom = new Classroom();
    this.pickClassroom.name = "- Odaberi razred -";
  }

  ngOnInit() {
    this.subjects.subscribe((x) => {
      this.showSpinner = false;
    });
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



  /****** modal functions  *****/

  openModalToAddSubject() {
    this.open("modalSubject");
  }

  openModalToEditSubject(subject: Subject) {
    // fill in the subject, and enable editing
    // copy the subject into the selected one:
    this.selectedSubject = JSON.parse(JSON.stringify(subject));
    // open modal for subjects:
    this.open("modalSubject");
  }

  openModalToAddQuiz(subject: Subject) {
    this.selectedSubject = JSON.parse(JSON.stringify(subject));
    this.open("modal");
  }

  openModalToEditQuiz(subject: Subject, quizID: string) {
    this.selectedSubject = JSON.parse(JSON.stringify(subject));
    // find the quiz that has that ID
    if (this.selectedSubject.quizzes != undefined) {
      // TODO - dont do a copy of the SelectedSubjet, but a reference:
      this.selectedQuiz = this.selectedSubject.quizzes.filter(elem => {
        if (elem.key === quizID) return true;
      })[0];
    }
    
    this.open("modal");
  }

  openModalToStartQuiz(subject: Subject) {
    // we need to select the quiz (from this subject)
    // and select which classroom that applies to.
    this.selectedSubject = JSON.parse(JSON.stringify(subject));
    this.selectedStartQuiz = new StartedQuiz();

    //default values:
    this.selectedStartQuiz.quiz = this.pickQuiz;
    this.selectedStartQuiz.classroom = this.pickClassroom;

    this.open("modalStartQuiz");
  }

  open(elementId: string) {
    var modal = null;
    if ((modal = document.getElementById(elementId)) != null) {
      modal.className += " is-active";
    }
  }

  closeModalSubject() {
    this.close("modalSubject");
  }

  closeModal() {
    this.close("modal");
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



















  /******* modal functions - SUBJECT *********/


  saveSubject() {
    if (this.selectedSubject.$key == undefined) {
      // TODO - check the quizzes:
      this.subjectService.createSubject(this.selectedSubject);
    } else {
      // to update, delete the key from the object, and put it manually:
      const key = this.selectedSubject.$key;
      const copy = Object.assign({}, this.selectedSubject);
      delete copy.$key;
      this.subjectService.updateSubject(key, copy);
    }

    this.reset(); // reset objects and close modal
    this.closeModalSubject();
  }

  deleteSubject() {
    this.subjectService.deleteSubject(this.selectedSubject.$key);
    this.closeModalSubject();
  }






  /******* modal functions - QUIZ *********/


  saveQuiz() {
    // XXX - create new if key doesnt exist
    if (this.selectedQuiz.key == undefined) {
      this.selectedQuiz.key = Date.now().toString();

      // XXX - we cant push into empty object:
      if (this.selectedSubject.quizzes == undefined) {
        this.selectedSubject.quizzes = []; 
      }
      this.selectedSubject.quizzes.push(this.selectedQuiz);
    }

    this.saveSubject();
    this.closeModal();
  }

  deleteQuiz() {
    if (this.selectedQuiz.key != undefined && this.selectedSubject.quizzes != undefined) {
      // remove the quiz from the subject and save changes:
      var index = this.selectedSubject.quizzes.indexOf(this.selectedQuiz);
      this.selectedSubject.quizzes.splice(index, 1);

      // save the subject:
      this.saveSubject();
    }
    this.closeModal();
  }




  /******** Schedule quiz **********/


  startQuiz() {
    console.log(this.selectedStartQuiz);

    // ostali podaci o ispitu
    // datum kraja, ili minute po pitanju

    // XXX - classroom nije potreban:
    this.selectedStartQuiz.classroom = this.selectedClassroom;
    this.selectedStartQuiz.classroomName = this.selectedClassroom.name;
    this.selectedStartQuiz.classroomKey = this.selectedClassroom.$key;
    this.selectedStartQuiz.subjectName = this.selectedSubject.name;
    this.selectedStartQuiz.subjectKey = this.selectedSubject.$key;

    console.log(this.selectedStartQuiz);

    //this.selectedStartQuiz.secondsPerQuestion = 10;
    // TODO find users that are students, and write the exam to them
    // TODO - re-route user to the quiz page
    // save quiz to database:
    console.log(this.selectedClassroom.students);

    this.subjectService.createQuiz(this.prepareQuiz());
    this.closeModalStartQuiz();
  }

  prepareQuiz() : StartedQuiz {
    // TODO - shuffle quiz questions, and answers
    // write them down

    // make a new quiz, shuffle questions, then shuffle answers
    this.selectedStartQuiz.quiz.questions = this.shuffleQuestions(this.selectedStartQuiz.quiz.questions);
    console.log(this.selectedStartQuiz.quiz.questions);

    console.log("unesi ispit");
    // TODO - secondsPerQuestion i openUntil = zahardkoridano
    var newQuiz: StartedQuiz = {
      quiz: this.selectedStartQuiz.quiz,
      // TODO - default je TRUE
      isSynced: false,
      isStarted: false,
      activeStudents: [],
    
      // time and students:
      professorName: this.subjectService.professorName,
      secondsPerQuestion: 10,
      openUntil: "26.05.2018.",
      active: true
    }
    if (this.selectedStartQuiz.classroom != undefined) {
      console.log(this.selectedStartQuiz.classroom);
      newQuiz.classroomName = this.selectedStartQuiz.classroom.name;
    }

    return newQuiz;
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

  // XXX - kopiranje kviza u public:
  copyQuizToPublic() {
    this.subjectService.copyQuizToPublic(this.prepareExercise());
    this.closeModal();
  }

  // TODO - zahardkodirane informacije
  prepareExercise() : StartedQuiz {
    // make a new quiz, shuffle questions, then shuffle answers
    this.selectedQuiz.questions = this.shuffleQuestions(this.selectedQuiz.questions);

    var newQuiz: StartedQuiz = {
      quiz: this.selectedQuiz,
      isSynced: false,
      isStarted: false,
      activeStudents: [],
    
      // time and students:
      professorName: this.subjectService.professorName,
      secondsPerQuestion: 10,
      openUntil: "28.05.2018",
      active: true
    }

    return newQuiz;
  }





  /********* functions for QUESTIONS *********/


  // TODO - additional function for adding a new question:
  addQuestion() {
    if (this.selectedQuiz.questions == undefined) {
      this.selectedQuiz.questions = [];
    }
    this.selectedQuiz.questions.push(this.addNewQuestion());
  }

  // XXX - make new question:
  addNewQuestion(): Question {
    var numberOfAnswers = 4;
    var question = new Question;
    
    question.answers = [];
    for (var i = 0; i < numberOfAnswers; i++) {
      question.answers.push(new Answer);
    }
    question.answers[0].correct = true;

    return question;
  }

  // TODO - make it an update (deactivate), not delete:
  deleteQuestion(question: Question) {
    // this, or send just index:
    var index = this.selectedQuiz.questions.indexOf(question);
    this.selectedQuiz.questions.splice(index, 1);
    this.dirty = true;
  }

}
