import { Component, OnInit } from '@angular/core';
import { StatService } from '../shared/stat.service';
import { Classroom, Quiz } from '../shared/stat';
import { Student } from '../../classrooms/shared/classroom';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'stats-list',
  templateUrl: './stats-list.component.html',
  styleUrls: ['./stats-list.component.scss'],
})
export class StatsListComponent implements OnInit {

  classrooms: Observable<Classroom[]>;
  showSpinner = true;
  dirty = false; // for check if confirm popup is needed
  tutorial = false; // show the instructions

  // for list of students:
  selectedClassroom: Classroom;
  // bool nije potreban ?:
  showQuestionsModal = true;
  selectedQuiz: Quiz;

  constructor(private statService: StatService) {
    this.classrooms = this.statService.getClassroomsList();
    this.reset();
  }

  ngOnInit() {
    this.classrooms.subscribe((x) => {
      this.showSpinner = false;
    });
  }


   /**** MODAL functions *****/

   // open modal with students:
  showStudents(classroom: Classroom) {
    this.selectedClassroom = JSON.parse(JSON.stringify(classroom));

    // order students by points:
    var users = this.selectedClassroom.students;
    if (users != undefined) {
      users.sort(function(a, b) {
        return a.points > b.points ? -1 : a.points < b.points ? 1 : 0
      })
    }

    this.open("studentsModal");
  }

  // open modal with questions:
  showQuestions(classroom: Classroom, examIndex: number) {
    this.selectedQuiz = JSON.parse(JSON.stringify(classroom.quizzes[examIndex]));
    // TODO - filter students, po redoslijedu (npr vremenu ?)

    var correct = 0;
    // order students by time:
    if (this.selectedQuiz.questions != undefined) {
      // za svako pitanje, sortiraj učenike po vremenu:
      for (var i = 0; i < this.selectedQuiz.questions.length; i++) {
        if (this.selectedQuiz.questions[i].givenAnswers != undefined) {
          this.selectedQuiz.questions[i].givenAnswers.sort(function(a, b) {
            return a.time > b.time ? 1 : a.time < b.time ? -1 : 0
          })
          var correct = 0;
          for (var j = 0; j < this.selectedQuiz.questions[i].givenAnswers.length; j++) {
            if (this.selectedQuiz.questions[i].givenAnswers[j].correct) {
              correct++;
            }
          }
          this.selectedQuiz.questions[i].percent =
              (correct / this.selectedQuiz.questions[i].givenAnswers.length) * 100;
        }

        

      }
    }

    this.open("questionsModal");
  }

  closeQuestions() {
    this.close("questionsModal");
  }

  closeStudents() {
    this.close("studentsModal");
  }

  open(elementId: string) {
    var modal = null;
    if ((modal = document.getElementById(elementId)) != null) {
      modal.className += " is-active";
    }
  }

  close(elementId: string) {
    var modal = null;
    if ((modal = document.getElementById(elementId)) != null) {
      modal.className = "modal";
    }
  }

  // reset classes:
  reset() {
    this.selectedQuiz = new Quiz;
    this.selectedClassroom = new Classroom;
  }

}
