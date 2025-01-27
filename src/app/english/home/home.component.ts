import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  courses = [
    {
      title: 'Biology Molecular',
      details: '21 lessons | 50 min | 312 students',
      progress: 79,
    },
    {
      title: 'Color Theory',
      details: '10 lessons | 45 min | 256 students',
      progress: 64,
    },
  ];

  actions = [
    {
      icon: 'question_answer',
      title: 'Consultation',
      description: 'Get a mentor to help your learning process.',
    },
    {
      icon: 'flag',
      title: 'Set Target',
      description: 'Set target, reminders, and your study timeline.',
    },
  ];

  chartData = [
    { data: [50, 60, 70, 62, 80, 95], label: 'Materials' },
    { data: [20, 30, 50, 40, 60, 75], label: 'Exams' },
  ];

  chartLabels = ['Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan'];

}
