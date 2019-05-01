import { Component, Input } from '@angular/core';
import { Subject } from '../subject';
import { SubjectService } from '../subject.service';

@Component({
  selector: 'subject-form',
  templateUrl: './subject-form.component.html',
  styleUrls: ['./subject-form.component.scss'],
})
export class SubjectFormComponent {

  // classroom: Classroom = new Classroom();
  @Input() subjectForm: Subject;

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
  }];

  exampleQuizzes = [{
    $key: "34324",
    name: "Kviz 1",
    questions: {
      question: "Pitanje broj jedan?",
      answers: ["odgovor 1", "odgovor 2", "odgovor 3", "odgovor 4"]
    }}, {
    $key: "34324",
    name: "Kviz 1",
    questions: {
      question: "Pitanje broj jedan?",
      answers: ["odgovor 1", "odgovor 2", "odgovor 3", "odgovor 4"]
    }
  }];

  exampleQuestions = [{
      question: "Pitanje broj jedan?",
      answers: ["odgovor 1", "odgovor 2", "odgovor 3", "odgovor 4"]
    }
    //, {
    //  question: "Pitanje broj jedan?",
    //  answers: ["odgovor 1", "odgovor 2", "odgovor 3", "odgovor 4"]
//  }
];



  constructor(private subjectService: SubjectService) { 
    //this.subjectForm = this.subjectService.getSelectedClassroom();
    this.subjectForm = new Subject();
    console.log(this.subjectForm);

    // TODO
    // dohvatiti postojeću formu ukoliko postoji
    // ako ne, onda prazan objekt

    // TODO - primjer kako bi trebalo izgledat da je forma popunjena:
    /*
    if (true) {
      this.subjectForm.name = "Novi razred";
      this.subjectForm.students = [{
        name: "Student jedan"
      }, {
        name: "Student dva"
      }, {
        name: "Student tri"
      }];
    }
    */

  }

  // TODO - fali forma - provjeriti da li radi
  deactivateStudent(id: number, classroomID: string) {
    console.log("deactivate student id: " + id);
    //this.subjectService.deactivateStudentFromClass(this.subjectForm.$key, id);
    // TODO - need a classroom ID and the student ID (array number)
  }

  saveClassroom() { // save classroom, and clear modal
    console.log("(form) save classroom:");
    console.log(this.subjectForm);

    //this.classroomService.createClassroom(this.classroomForm);
    this.close(); // close and reset object
  }

  close() {
    //this.classroomService.deselectClassroom();
    this.subjectForm = new Subject(); // reset classroom
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
    //this.subjectService.updateClassroom(this.subjectForm.$key, { active: value });
  }

  deleteClassroom() {
    //this.subjectService.deleteClassroom(this.subjectForm.$key);
  }

  checkChange() {

  }

}
