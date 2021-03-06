import { Component, Input } from '@angular/core';
import { ExamService } from '../exam.service';
import { ExamsListComponent } from '../exams-list/exams-list.component';
import { StartedQuiz } from '../../subjects/subject';

@Component({
  selector: 'exam-detail',
  templateUrl: './exam-detail.component.html',
  styleUrls: ['./exam-detail.component.scss']
})
export class ExamDetailComponent {

  @Input() exam: StartedQuiz;
  tutorial = false;

  constructor(private examService: ExamService, private examList: ExamsListComponent) {
    this.tutorial = examList.tutorial;
   }

   showResults() {
     this.examList.checkStatus(this.exam);
   }

}
