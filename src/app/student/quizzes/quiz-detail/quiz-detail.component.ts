import { Component, Input } from '@angular/core';
import { QuizService } from '../quiz.service';
import { QuizzesListComponent } from '../quizzes-list/quizzes-list.component';
import { StartedQuiz } from '../../../professor/subjects/subject';

@Component({
  selector: 'quiz-detail',
  templateUrl: './quiz-detail.component.html',
  styleUrls: ['./quiz-detail.component.scss']
})
export class QuizDetailComponent {

  @Input() quiz: StartedQuiz;
  tutorial = false;

  constructor(private quizService: QuizService, private quizList: QuizzesListComponent) {
    this.tutorial = quizList.tutorial;
   }

   startQuiz() {
      this.quizList.startDetails(this.quiz);
   }

}
