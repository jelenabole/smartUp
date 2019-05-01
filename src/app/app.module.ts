import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

///// Start FireStarter

// Core
import { CoreModule } from './core/core.module';

// Shared/Widget
import { SharedModule } from './shared/shared.module';

// Feature Modules
import { UiModule } from './ui/shared/ui.module';

import { ClassroomModule } from './professor/classrooms/classroom.module';
import { SubjectModule } from './professor/subjects/subject.module';
import { ExamModule } from './professor/exams/exam.module';
import { StatModule } from './professor/stats/stat.module';

import { QuizModule } from './student/quizzes/quiz.module';
import { ExerciseModule } from './student/exercises/exercise.module';
import { ResultModule } from './student/results/result.module';
///// End FireStarter

import { environment } from '../environments/environment';

import { AngularFireModule } from 'angularfire2';
export const firebaseConfig = environment.firebaseConfig;
import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    UiModule,

    ClassroomModule,
    SubjectModule,
    ExamModule,
    StatModule,

    QuizModule,
    ExerciseModule,
    ResultModule,

    ChartsModule,

    AngularFireModule.initializeApp(firebaseConfig),
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
