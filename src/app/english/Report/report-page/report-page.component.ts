import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CRUDService } from 'src/app/crud.service';
import { AnsReport, AnsReportRes, Class, ClassRes, Week, WeekRes } from 'src/app/interface/Question.interface';
import { UserData } from 'src/app/interface/student.interface';
import { SharedService } from 'src/app/shared.service';
import { ReportPageDeatilsComponent } from '../report-page-deatils/report-page-deatils.component';
import { AnsPriviewComponent } from '../ans-priview/ans-priview.component';

@Component({
  selector: 'app-report-page',
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.scss']
})
export class ReportPageComponent implements OnInit {
  displayedColumns: string[] = [
    'expand',
    'sl',
    'date',
    'day',
    'totalQuestion',
    'attempted',
    'present',
    'correct',
    'wrong',
    'percent',
    'view'
  ];

  AnsReports: AnsReport[] = []
  Weeks: Week[] = []
  Classes: Class[] = []
  Seletedclass: string = ''
  Seletedweek: string = ''
  Seletedtopics: string = ''
  userData: any


  constructor(
    private _crud: CRUDService,
    private _shared: SharedService,
    private _dialog: MatDialog
  ) {
    this.userData = JSON.parse(sessionStorage.getItem('rluser') || '{}');

  }
  ngOnInit() {
    const updatedUserDataString = sessionStorage.getItem('rluser');
    if (updatedUserDataString) {
      try {
        this.userData = JSON.parse(updatedUserDataString) as UserData;
        console.log('User data loaded:', this.userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    this.get_week()
    this.get_cls()
    this.get_ans()
  }

  get_ans() {
    this._crud.ans_get({
      std_id: this.userData.ID,
      class: this.Seletedclass,
      week: this.Seletedweek,
      topics: this.Seletedtopics
    }).subscribe(
      (res: AnsReportRes) => {
        console.log(res);
        if (Array.isArray(res.data)) {
          this.AnsReports = res.data
        }

      }
    )
  }

  get_week() {
    this._crud.getWeek().subscribe(
      (res: WeekRes) => {
        console.log(res, 'weeks');

        if (Array.isArray(res.data)) {
          this.Weeks = res.data
          this.Seletedweek = res.data[0].week_num
        }
      }
    )
  }

  get_cls() {
    this._crud.getClass().subscribe(
      (res: ClassRes) => {
        console.log(res);
        if (Array.isArray(res.data)) {
          this.Classes = res.data
        }
      }
    )
  }

  getCorrectPercentage(element: any): number {
    return element.total_qty > 0
      ? (element.right_ans / element.total_qty) * 100
      : 0;
  }

  onClassChange(classValue: string): void {
    this.Seletedclass = classValue;
    this.get_ans();
  }

  onWeekChange(weekValue: string): void {
    this.Seletedweek = weekValue;
    this.get_ans();
  }

  onView(el: any) {
    const data = {
      day: el.day,
      week: el.week,
      std_id: this.userData.ID
    }

    document.body.classList.add('dialog-blur-bg');

    const dialogRef = this._dialog.open(AnsPriviewComponent, {
      data: data,
      width: '70vw',
      maxWidth: '70vw',
      height: '100vh',
      maxHeight: '100vh',
      panelClass: 'full-width-no-padding-dialogans',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(() => {
      document.body.classList.remove('dialog-blur-bg');
    });

  }


  OneOpenDilog(day: string) {
    document.body.classList.add('dialog-blur-bg');

    const data = {
      day: day,
      week: this.Seletedweek,
      std_id: this.userData.ID
    }
    console.log(data, 'redpo');
    
    const dialogRef = this._dialog.open(ReportPageDeatilsComponent, {
      data: data,
      width: '100vw',
      maxWidth: '100vw',
      height: 'auto',
      maxHeight: '90vh',
      panelClass: 'full-width-no-padding-dialog',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(() => {
      document.body.classList.remove('dialog-blur-bg');
    });
  }




}
