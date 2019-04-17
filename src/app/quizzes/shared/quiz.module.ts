import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireDatabaseModule } from 'angularfire2/database';

import { SharedModule } from '../../shared/shared.module';

import { QuizService } from './quiz.service';

import { QuizzesListComponent } from '../quizzes-list/quizzes-list.component';
import { QuizFormComponent } from '../quiz-form/quiz-form.component';
import { QuizDetailComponent } from '../quiz-detail/quiz-detail.component';
import { UserService } from '../../shared/user.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireDatabaseModule,
  ],
  declarations: [
    QuizzesListComponent,
    QuizFormComponent,
    QuizDetailComponent,
  ],
  providers: [
    QuizService,
    UserService
  ],
})
export class QuizModule { }
