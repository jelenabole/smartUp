import { Component, Input } from '@angular/core';
import { QuizService } from '../shared/quiz.service';
import { Quiz } from '../shared/quiz';
import { QuizzesListComponent } from '../quizzes-list/quizzes-list.component';
import { StartedQuiz } from '../../subjects/shared/subject';

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
