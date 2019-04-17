import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireDatabaseModule } from 'angularfire2/database';

import { SharedModule } from '../../shared/shared.module';

import { ExamService } from './exam.service';

import { ExamsListComponent } from '../exams-list/exams-list.component';
import { ExamDetailComponent } from '../exam-detail/exam-detail.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireDatabaseModule,
  ],
  declarations: [
    ExamsListComponent,
    ExamDetailComponent,
  ],
  providers: [
    ExamService,
  ],
})
export class ExamModule { }
