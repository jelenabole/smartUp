import { Component, Input } from '@angular/core';
import { SubjectService } from '../shared/subject.service';
import { Subject, Quiz } from '../shared/subject';
import { SubjectsListComponent } from '../subjects-list/subjects-list.component';

@Component({
  selector: 'subject-detail',
  templateUrl: './subject-detail.component.html',
  styleUrls: ['./subject-detail.component.scss']
})
export class SubjectDetailComponent {

  @Input() subject: Subject;

  constructor(private subjectService: SubjectService, private subjectList: SubjectsListComponent) { }


  editSubject() {
    this.subjectList.openModalToEditSubject(this.subject);
  }

  addQuiz() {
    this.subjectList.openModalToAddQuiz(this.subject);
  }

  editQuiz(quizID: string) {
    // TODO - drop just the ID?
    this.subjectList.openModalToEditQuiz(this.subject, quizID);
  }

  startQuiz() {
    this.subjectList.openModalToStartQuiz(this.subject);
  }

}
