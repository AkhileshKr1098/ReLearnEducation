import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CRUDService } from 'src/app/crud.service';
import { AnsReport, AnsReportRes } from 'src/app/interface/Question.interface';
import { UserData } from 'src/app/interface/student.interface';
import { SharedService } from 'src/app/shared.service';

interface datas {
  day: string,
  std_id: string
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

  userData: UserData = {
    LoginId: '',
    ID: '',
    UserName: '',
    DOB: '',
    AbacusMaster: '',
    AsignDate: '',
    AsignDay: '',
    CSDate: '',
    ContactNo: '',
    Course: '',
    Currency: '',
    CustomWeek: '',
    GameTimeInterval: '',
    GraceDays: '',
    Group1: '',
    HolidayFrom: null,
    HolidayTo: null,
    Level: '',
    LittleChamp: '',
    LittleLeap: '',
    LittleMaster: '',
    LittleProdigy: '',
    LittleStart: '',
    MaxQToDo: '',
    Status: '',
    Validity: null,
    Week: '',
    narratorSpeed: ''
  };


  constructor(
    private _crud: CRUDService,
    private _shared: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: datas,

  ) {

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
    if (this.data) {
      this.get_report(this.data.std_id, this.data.day)
    }

  }


  get_report(std: string, day: string) {
    this._crud.ans_get_topics({
      std_id: std,
      day: day
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
