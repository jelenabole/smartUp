import { Component, OnInit } from '@angular/core';
import { ClassroomService } from '../classroom.service';
import { Classroom, Student } from '../classroom';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'classrooms-list',
  templateUrl: './classrooms-list.component.html',
  styleUrls: ['./classrooms-list.component.scss'],
})
export class ClassroomsListComponent implements OnInit {

  classrooms: Observable<Classroom[]>;
  showSpinner = true;
  // for modal window:
  showForm = true; // why true !?!?
  showQRModal = false;
  dirty = false; // for check if confirm popup is needed
  tutorial = false; // show the instructions

  selectedClassroom: Classroom;

  constructor(private classroomService: ClassroomService) {
    this.classrooms = this.classroomService.getClassroomsList();
    this.newClass();
  }

  newClass() {
    this.selectedClassroom = new Classroom;
  }

  ngOnInit() {
    this.classrooms.subscribe((x) => {
      this.showSpinner = false;
    });
  }



  /**** buttons functions *****/


  saveClassroom() { // save classroom, and clear modal
    console.log("save");
    
    if (this.selectedClassroom.$key == undefined) {
      this.classroomService.createClassroom(this.selectedClassroom);
    } else {
      // to update, delete the key from the object, and put it manually:
      const key = this.selectedClassroom.$key;
      const copy = Object.assign({}, this.selectedClassroom);
      delete copy.$key;
      this.classroomService.updateClassroom(key, copy);
    }
    this.newClass();
    this.closeModal(); // close and reset object
  }

  // TODO - make it an update (deactivate), not delete:
  deleteStudent(student: Student) {
    // this, or send just index:
    var index = this.selectedClassroom.students.indexOf(student);
    this.selectedClassroom.students.splice(index, 1);
    this.dirty = true;
  }

  deleteClassroom() {
    // console.log("delete id: " + this.selectedClassroom.$key);
    if (this.selectedClassroom.$key != undefined)
      this.classroomService.deleteClassroom(this.selectedClassroom.$key);
    this.closeModal();
  }

  checkChange() {
    // TODO - check what is checked - checkboxes
    this.dirty = true;
  }

  // TODO - button hidden:
  prepareQuizModal(classroom: Classroom) {
    console.log("dohvati predmete i ispite, te pokreni za učenike");
  }


  
  /****** modal functions  *****/

  addNewClassroom() {
    //this.selectedClassroom = new Classroom;
    this.showForm = true;
    this.open("modal");
  }

  openModal(classroom: Classroom) {
    // shallow copy (changes seen but not saved):
    // this.selectedClassroom = classroom;
    // TODO - this doesnt work on nested objects:
    // this.selectedClassroom = Object.assign({}, classroom);
    // TODO - copy nested object:
    this.selectedClassroom = JSON.parse(JSON.stringify(classroom));

    this.showForm = true;
    this.open("modal");
  }

  closeModal() {
    this.close("modal");
  }

  showQRCode(classroom: Classroom) {
    // TODO - make a QR code for this class
    this.selectedClassroom = classroom;
    this.showQRModal = true;
    this.open("modalQRCode");
  }

  closeQRCode() {
    this.showQRModal = false;
    this.close("modalQRCode");
  }

  open(elementId: string) {
    var modal = null;
    if ((modal = document.getElementById(elementId)) != null) {
      modal.className += " is-active";
    }
  }

  close(elementId: string) {
    this.newClass(); // reset classroom
    var modal = null;
    if ((modal = document.getElementById(elementId)) != null) {
      modal.className = "modal";
    }
  }

}
