import { Component, Input } from '@angular/core';
import { Classroom } from '../stat';
import { StatsListComponent } from '../stats-list/stats-list.component';

@Component({
  selector: 'stat-detail',
  templateUrl: './stat-detail.component.html',
  styleUrls: ['../../detail.component.scss', './stat-detail.component.scss']
})
export class StatDetailComponent {

  @Input() classroom: Classroom;
  tutorial = false;

  constructor(private statList: StatsListComponent) {
    this.tutorial = statList.tutorial;
  }

  showStudents() {
    this.statList.showStudents(this.classroom);
  }

  showQuestions(examIndex: number) {
    this.statList.showQuestions(this.classroom, examIndex);
  }

}