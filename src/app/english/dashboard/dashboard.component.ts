import { Component, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { isArray } from 'chart.js/dist/helpers/helpers.core';
import { CRUDService } from 'src/app/crud.service';
import { Sections, SectionsFilter, SectionsFilterRes, SectionsRes, SubTopic, Topics, Week } from 'src/app/interface/Question.interface';
import { SharedService } from 'src/app/shared.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  @ViewChild(MatAccordion) accordion!: MatAccordion;

  weeksList: Week[] = []
  TopicsList: Topics[] = []
  SectionsList: SectionsFilter[] = []
  SectionsListFilter: SectionsFilter[] = []
  allTopics: string = ''
  userData: any = {};
  currentWeek: any = 0;
  currentDay: any = 0;
  days1 = [
    { name: '1', url: '../../../assets/icon/day1.png' },
    { name: '2', url: '../../../assets/icon/day2.png' },
    { name: '3', url: '../../../assets/icon/day3.png' }

  ];

  days2 = [
    { name: '4', url: '../../../assets/icon/day4.png' },
    { name: '5', url: '../../../assets/icon/day5.png' },
    { name: '6', url: '../../../assets/icon/day6.png' },

  ];



  constructor(
    private _crud: CRUDService,
    private shared: SharedService,
    private _router: Router
  ) {
    this.userData = JSON.parse(sessionStorage.getItem('rluser') || '{}');
    this.currentWeek = this.shared.currentWeek.getValue();
    this.currentDay = this.shared.currentDay.getValue();
  }


  ngOnInit() {
    this.getWeeks()
    this.getSections()
  }

  getWeeks() {
    this._crud.getWeek().subscribe(
      (res) => {
        console.log(res);
        if (Array.isArray(res.data)) {
          this.weeksList = res.data
        }
      }
    )
  }

  getTopics() {
    this._crud.getTopics().subscribe(
      (res) => {
        this.allTopics = ''
        console.log(res)
        if (Array.isArray(res.data)) {
          this.TopicsList = res.data
          for (let index = 0; index < res.data.length; index++) {
            if (index == 0) {
              this.allTopics += res.data[index].topics
            } else {
              this.allTopics += ', ' + res.data[index].topics
            }
          }

          console.log(this.allTopics)

        }
      }
    )
  }


  getSections() {
    const cls = this.userData.Class
    this._crud.getsectionsFilter(cls).subscribe(
      (res: SectionsFilterRes) => {
        if (Array.isArray(res.data)) {
          this.SectionsList = res.data
          this.SectionsListFilter = res.data
        }
      }
    )

    this.getTopics()
  }

  onTopics(day: any, event: MouseEvent) {
    console.log(day.name);
    sessionStorage.setItem('selectedDay', JSON.stringify(day.name));

    event.preventDefault();
    console.log(day);
    this._router.navigate(['/english/topics']);
  }


  onGetSections(week: number) {
    console.log(week);

    this.SectionsList = this.SectionsListFilter.filter((item: any) => item.week == week)
    console.log(this.SectionsList);


  }

    setDefaultImage(event: any) {
  event.target.src = '../../../assets/icon/profile.jpeg';
}

}


