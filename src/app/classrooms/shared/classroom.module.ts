import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireDatabaseModule } from 'angularfire2/database';

import { SharedModule } from '../../shared/shared.module';

import { ClassroomService } from './classroom.service';

import { ClassroomsListComponent } from '../classrooms-list/classrooms-list.component';
import { ClassroomFormComponent } from '../classroom-form/classroom-form.component';
import { ClassroomDetailComponent } from '../classroom-detail/classroom-detail.component';
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
    ClassroomsListComponent,
    ClassroomFormComponent,
    ClassroomDetailComponent,
  ],
  providers: [
    ClassroomService,
    UserService
  ],
})
export class ClassroomModule { }
