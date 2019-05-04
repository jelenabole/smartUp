import { Component, Input } from '@angular/core';
import { ClassroomService } from '../classroom.service';
import { Classroom } from '../classroom';
import { ClassroomsListComponent } from '../classrooms-list/classrooms-list.component';

@Component({
  selector: 'classroom-detail',
  templateUrl: './classroom-detail.component.html',
  styleUrls: ['../../detail.component.scss', './classroom-detail.component.scss']
})
export class ClassroomDetailComponent {

  @Input() classroom: Classroom;
  tutorial = false;

  constructor(private classroomService: ClassroomService, private classList: ClassroomsListComponent) {
    this.tutorial = classList.tutorial;
  }

  editClassroom() {
    console.log("edit");
    this.classList.openModal(this.classroom);
  }

  addStudents() {
    this.classList.showQRCode(this.classroom);
  }

  // TODO - button hidden:
  startQuiz() {
    this.classList.prepareQuizModal(this.classroom);
  }

}
