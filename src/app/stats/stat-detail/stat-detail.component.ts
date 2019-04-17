import { Component, Input } from '@angular/core';
import { StatService } from '../shared/stat.service';
import { Classroom } from '../shared/stat';
import { StatsListComponent } from '../stats-list/stats-list.component';

@Component({
  selector: 'stat-detail',
  templateUrl: './stat-detail.component.html',
  styleUrls: ['./stat-detail.component.scss']
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
