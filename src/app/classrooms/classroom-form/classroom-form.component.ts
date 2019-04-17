import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Classroom } from '../shared/classroom';

import { Observable } from 'rxjs/Observable';
import { ClassroomService } from '../shared/classroom.service';

@Component({
  selector: 'classroom-form',
  templateUrl: './classroom-form.component.html',
  styleUrls: ['./classroom-form.component.scss'],
})
export class ClassroomFormComponent {

  // classroom: Classroom = new Classroom();
  @Input() classroomForm: Classroom;

  // TODO - catch all subjects from the professor:
  allSubjects = [{
    $key: "1234",
    name: "Matematika 1"
  }, {
    $key: "34324",
    name: "Matematika 2"
  }, {
    $key: "4324",
    name: "Hrvatski jezik"
  }, {
    $key: "54323",
    name: "Engleski jezik"
  }]


  constructor(private classroomService: ClassroomService) { 
    this.classroomForm = new Classroom();
    console.log(this.classroomForm);

    
    
    // TODO
    // dohvatiti postojeću formu ukoliko postoji
    // ako ne, onda prazan objekt

    // TODO - primjer kako bi trebalo izgledat da je forma popunjena:
    console.log("CONSTRUCTOR");
    if (true) {
      this.classroomForm.name = "Novi razred";
      this.classroomForm.students = [{
        name: "Student jedan"
      }, {
        name: "Student dva"
      }, {
        name: "Student tri"
      }];
    }

  }

  // TODO - fali forma - provjeriti da li radi
  deactivateStudent(id: number, classroomID: string) {
    console.log("deactivate student id: " + id);
//    this.classroomService.deactivateStudentFromClass(this.classroomForm.$key, id);
    // TODO - need a classroom ID and the student ID (array number)
  }

  saveClassroom() { // save classroom, and clear modal
    console.log("(form) save classroom:");
    console.log(this.classroomForm);

    //this.classroomService.createClassroom(this.classroomForm);
    this.close(); // close and reset object
  }

  close() {
    //this.classroomService.deselectClassroom();
    this.classroomForm = new Classroom(); // reset classroom
    this.closeModal("modal");
  }

  // TODO - additional function - merge with the close() ??
  closeModal(id: string) {
    var modal = null;
    if ((modal = document.getElementById(id)) != null) {
      modal.className = "modal";
    }
  }

  // TODO - check this functions - additional buttons:
  updateActive(value: boolean) {
    //this.classroomService.updateClassroom(this.classroomForm.$key, { active: value });
  }

  deleteClassroom() {
    //this.classroomService.deleteClassroom(this.classroomForm.$key);
  }

  checkChange() {

  }

}
