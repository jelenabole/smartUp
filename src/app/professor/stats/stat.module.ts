import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { SharedModule } from '../../shared/shared.module';
import { StatService } from './stat.service';
import { StatsListComponent } from './stats-list/stats-list.component';
import { UserService } from '../../shared/user.service';
import { StatDetailComponent } from './stat-detail/stat-detail.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireDatabaseModule,
  ],
  declarations: [
    StatsListComponent,
    StatDetailComponent,
  ],
  providers: [
    StatService,
    UserService
  ],
})
export class StatModule { }
