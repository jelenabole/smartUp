import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireDatabaseModule } from 'angularfire2/database';

import { SharedModule } from '../../shared/shared.module';

import { ResultsListComponent } from '../results-list/results-list.component';
import { UserService } from '../../shared/user.service';
import { ResultService } from './result.service';

import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireDatabaseModule,
    ChartsModule,
  ],
  declarations: [
    ResultsListComponent,
  ],
  providers: [
    ResultService,
    UserService
  ],
})
export class ResultModule { }
