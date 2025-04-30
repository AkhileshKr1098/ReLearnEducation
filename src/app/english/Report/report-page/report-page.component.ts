import { Component, OnInit } from '@angular/core';
import { CRUDService } from 'src/app/crud.service';
import { AnsReport, AnsReportRes, Class, ClassRes, Week, WeekRes } from 'src/app/interface/Question.interface';
import { UserData } from 'src/app/interface/student.interface';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-report-page',
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.scss']
})
export class ReportPageComponent implements OnInit {
  displayedColumns: string[] = ['expand', 'sno', 'date', 'day', 'totalQuestion', 'attempted', 'correct', 'wrong', 'percent'];
  AnsReports: AnsReport[] = []
  Weeks: Week[] = []
  Classes: Class[] = []
  Seletedclass: string = ''
  Seletedweek: string = ''
  Seletedtopics: string = ''

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
    private _shared: SharedService
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

    this.get_week()
    this.get_cls()
    this.get_ans()


  }
  dataSource = [
    { sno: 1, date: '', day: 1, total: 90, attempted: 0, correct: 0, wrong: 0, percent: 0 },
    { sno: 2, date: '', day: 2, total: 25, attempted: 0, correct: 0, wrong: 0, percent: 0 },
    { sno: 3, date: '', day: 3, total: 25, attempted: 0, correct: 0, wrong: 0, percent: 0 },
    { sno: 4, date: '', day: 4, total: 25, attempted: 0, correct: 0, wrong: 0, percent: 0 },
    { sno: 5, date: '', day: 5, total: 25, attempted: 0, correct: 0, wrong: 0, percent: 0 },
    { sno: 6, date: '', day: 6, total: 24, attempted: 0, correct: 0, wrong: 0, percent: 0 }
  ];

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
        if (Array.isArray(res.data)) {
          this.Weeks = res.data
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
}
