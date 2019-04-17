import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireDatabaseModule } from 'angularfire2/database';

import { SharedModule } from '../../shared/shared.module';

import { ExercisesListComponent } from '../exercises-list/exercises-list.component';
import { ExerciseDetailComponent } from '../exercise-detail/exercise-detail.component';
import { ExerciseService } from './exercise.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireDatabaseModule,
  ],
  declarations: [
    ExercisesListComponent,
    ExerciseDetailComponent,
  ],
  providers: [
    ExerciseService,
  ],
})
export class ExerciseModule { }
