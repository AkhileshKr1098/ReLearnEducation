import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CRUDService } from 'src/app/crud.service';
import { AnsReport, AnsReportRes } from 'src/app/interface/Question.interface';
import { UserData } from 'src/app/interface/student.interface';
import { SharedService } from 'src/app/shared.service';

interface datas {
  day: number,
  std_id: string,
  week: number
}
@Component({
  selector: 'app-report-page-deatils',
  templateUrl: './report-page-deatils.component.html',
  styleUrls: ['./report-page-deatils.component.scss']
})
export class ReportPageDeatilsComponent {
  displayedColumns: string[] = [
    'sl',
    'Topic',
    'day',
    'totalQuestion',
    'attempted',
    'present',
    'correct',
    'wrong',
    'percent'
  ];

  AnsReports: AnsReport[] = []
  userData: any

  constructor(
    private _crud: CRUDService,
    private _shared: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: datas,

  ) {

  }
  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('rluser') || '{}');

    this.get_report(this.userData.ID, this.data.day, this.data.week)

  }


  get_report(std: string, day: number, week: number) {
    this._crud.ans_get_topics({
      std_id: std,
      day: day,
      week: week
    }).subscribe(
      (res: AnsReportRes) => {
        console.log(res);
        if (Array.isArray(res.data)) {
          this.AnsReports = res.data
        }

      }
    )
  }



  getCorrectPercentage(element: any): number {
    return element.total_qty > 0
      ? (element.right_ans / element.total_qty) * 100
      : 0;
  }

}
