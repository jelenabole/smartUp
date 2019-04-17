import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Quiz } from '../shared/quiz';

import { Observable } from 'rxjs/Observable';
import { QuizService } from '../shared/quiz.service';

@Component({
  selector: 'quiz-form',
  templateUrl: './quiz-form.component.html',
  styleUrls: ['./quiz-form.component.scss'],
})
export class QuizFormComponent {

  @Input() quizForm: Quiz;

  constructor(private quizService: QuizService) { 
    this.quizForm = new Quiz();
    console.log(this.quizForm);

  }

  close() {
    this.quizForm = new Quiz(); // reset quiz
    this.closeModal("modal");
  }

  // TODO - additional function - merge with the close() ??
  closeModal(id: string) {
    var modal = null;
    if ((modal = document.getElementById(id)) != null) {
      modal.className = "modal";
    }
  }
 
}
