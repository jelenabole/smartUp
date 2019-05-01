import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserLoginComponent } from './ui/user-login/user-login.component';
import { ReadmePageComponent } from './ui/readme-page/readme-page.component';
// professors pages:
import { ClassroomsListComponent } from './professor/classrooms/classrooms-list/classrooms-list.component';
import { SubjectsListComponent } from './professor/subjects/subjects-list/subjects-list.component';
import { ExamsListComponent } from './professor/exams/exams-list/exams-list.component';
import { StatsListComponent } from './professor/stats/stats-list/stats-list.component';
// students pages:
import { QuizzesListComponent } from './student/quizzes/quizzes-list/quizzes-list.component';
import { ExercisesListComponent } from './student/exercises/exercises-list/exercises-list.component';
import { ResultsListComponent } from './student/results/results-list/results-list.component';

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
