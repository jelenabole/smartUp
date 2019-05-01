import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { SharedModule } from '../../shared/shared.module';
import { SubjectService } from './subject.service';
import { SubjectsListComponent } from './subjects-list/subjects-list.component';
import { SubjectFormComponent } from './subject-form/subject-form.component';
import { SubjectDetailComponent } from './subject-detail/subject-detail.component';
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
    SubjectsListComponent,
    SubjectFormComponent,
    SubjectDetailComponent,
  ],
  providers: [
    SubjectService,
    UserService
  ],
})
export class SubjectModule { }
