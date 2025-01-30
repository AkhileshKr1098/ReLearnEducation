import { Component } from '@angular/core';
import { Chart, ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js'
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  callStatics: any = [12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  public chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          color: 'rgba(200, 200, 200, 0.2)' // Light gray grid lines
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 14
          },
          color: "#333"
        }
      }
    }
  };
  
  public chartType: ChartType = 'line';
  
  public chartData: ChartConfiguration['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        data: this.callStatics, 
        label: 'Call',
      borderColor: '#FF3B30', 
      backgroundColor: 'rgba(255, 59, 48, 0.3)', 
      fill: true, 
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBackgroundColor: '#FF3B30',
      tension: 0.4 
      },
  
    ],

    
  };


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

  constructor() { 
    Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

  }

  ngOnInit() {
    // Initialize chart data or fetch data from a service
  }
}
