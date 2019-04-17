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

import { ClassroomModule } from './classrooms/shared/classroom.module';
import { SubjectModule } from './subjects/shared/subject.module';
import { ExamModule } from './exams/shared/exam.module';
import { StatModule } from './stats/shared/stat.module';

import { QuizModule } from './quizzes/shared/quiz.module';
import { ExerciseModule } from './exercises/shared/exercise.module';
import { ResultModule } from './results/shared/result.module';
///// End FireStarter

import { environment } from '../environments/environment';

import { AngularFireModule } from 'angularfire2';
export const firebaseConfig = environment.firebaseConfig;
import { AngularFirestoreModule } from 'angularfire2/firestore';
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
