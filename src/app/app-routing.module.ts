import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserLoginComponent } from './ui/user-login/user-login.component';
import { ReadmePageComponent } from './ui/readme-page/readme-page.component';
import { ClassroomsListComponent } from './classrooms/classrooms-list/classrooms-list.component';
import { SubjectsListComponent } from './subjects/subjects-list/subjects-list.component';
import { ExamsListComponent } from './exams/exams-list/exams-list.component';
import { StatsListComponent } from './stats/stats-list/stats-list.component';

import { QuizzesListComponent } from './quizzes/quizzes-list/quizzes-list.component';
import { ExercisesListComponent } from './exercises/exercises-list/exercises-list.component';
import { ResultsListComponent } from './results/results-list/results-list.component';

import { AuthGuard } from './core/auth.guard';

const routes: Routes = [
  { path: '', component: ReadmePageComponent },
  { path: 'login', component: UserLoginComponent },

  // professors pages:
  { path: 'classrooms', component: ClassroomsListComponent, canActivate: [AuthGuard] },
  { path: 'subjects', component: SubjectsListComponent, canActivate: [AuthGuard] },
  { path: 'exams', component: ExamsListComponent, canActivate: [AuthGuard] },
  { path: 'stats', component: StatsListComponent, canActivate: [AuthGuard] },

  // student pages:
  { path: 'quizzes', component: QuizzesListComponent, canActivate: [AuthGuard] },
  { path: 'exercises', component: ExercisesListComponent, canActivate: [AuthGuard] },
  { path: 'results', component: ResultsListComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule { }
