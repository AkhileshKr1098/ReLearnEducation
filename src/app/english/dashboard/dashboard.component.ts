import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  todayCourses = [
    {
      icon: "🧬",
      title: "Biology Molecular",
      lessons: 21,
      duration: 50,
      students: 312,
      progress: 79,
    },
    {
      icon: "🎨",
      title: "Color Theory",
      lessons: 10,
      duration: 45,
      students: 256,
      progress: 64,
    },
  ]

  yourClasses = [
    {
      icon: '🦠',
      title: 'Microbiology Society',
      lessons: 10,
      duration: 45,
      students: 255
    }
  ];

  constructor() {}

  ngOnInit() {
    // Initialize chart data or fetch data from a service
  }
}
