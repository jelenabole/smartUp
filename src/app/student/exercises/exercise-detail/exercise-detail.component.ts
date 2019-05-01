import { Component, Input } from '@angular/core';
import { ExerciseService } from '../exercise.service';
import { ExercisesListComponent } from '../exercises-list/exercises-list.component';
import { StartedQuiz } from '../../../professor/subjects/subject';

@Component({
  selector: 'exercise-detail',
  templateUrl: './exercise-detail.component.html',
  styleUrls: ['./exercise-detail.component.scss']
})
export class ExerciseDetailComponent {

  @Input() exercise: StartedQuiz;
  tutorial = false;

  constructor(private exerciseService: ExerciseService, private exerciseList: ExercisesListComponent) {
    this.tutorial = this.exerciseList.tutorial;
   }

   startExercise() {
     this.exerciseList.startDetails(this.exercise);
   }

}
