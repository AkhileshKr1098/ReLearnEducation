import { Component, AfterViewInit, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CRUDService } from 'src/app/crud.service';
import { ConfirmDialogComponent } from '../QuestionType/confirm-dialog/confirm-dialog.component';
import { CorrectBoxComponent } from '../correct-box/correct-box.component';
import { OppsBoxComponent } from '../opps-box/opps-box.component';
import { AnsReportRes, QuestionData, QuestionDataRes } from 'src/app/interface/Question.interface';
import { SharedService } from 'src/app/shared.service';
import { CurrentReportRes } from 'src/app/interface/report.interafce';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, AfterViewInit {

  isSaveVisible = false;
  QuestionType: string = '';
  SelectedTopics: string = '';
  AllQuestion: QuestionData[] = [];
  CurrentQuestion: QuestionData = this.getEmptyQuestion();
  base_url: string = '';
  CurrentReport: CurrentReportRes = this.getEmptyReport();
  userData: any = {};
  currentWeek: any = 0;
  currentDay: any = 0;
  i = 0;

  constructor(
    private _crud: CRUDService,
    private dialog: MatDialog,
    public shared: SharedService
  ) {
    this._crud.img_base_url.subscribe(res => {
      this.base_url = res;
    });

    this.userData = JSON.parse(sessionStorage.getItem('rluser') || '{}');
    this.SelectedTopics = sessionStorage.getItem('SelectedTopics') || '';
    this.currentWeek = this.shared.currentWeek.getValue();
    this.currentDay = this.shared.currentDay.getValue();
  }

  ngOnInit(): void {
    if (this.userData?.Class && this.userData?.ID) {
      this._crud.getQuestionFilter(this.userData.Class, this.currentWeek, this.shared.currentDay.getValue(), this.userData.ID, this.SelectedTopics, this.userData?.MaxQToDo)
        .subscribe((res: QuestionDataRes) => {
          if (Array.isArray(res.data)) {
            this.AllQuestion = res.data;
            console.log(this.AllQuestion);

            this.shared.AllQuestionList.next(res);

            if (this.AllQuestion.length) {
              this.i = 0;
              this.CurrentQuestion = this.AllQuestion[this.i];
              this.QuestionType = this.CurrentQuestion.question_type;
            }

            this.NextQuestion();
          }
        });
    }

    this.shared.CurrentQuestionStatus.subscribe(res => {
      if (res === true) {
        this.NextQuestion();
      }
    });

    this.getCurrentReport();
  }

  ngAfterViewInit(): void {
    console.log('AfterViewInit called');
  }

  getCurrentReport(): void {
    if (this.userData?.ID && this.userData?.Class) {
      this._crud.get_current_report({
        std_id: this.userData.ID,
        class: this.userData.Class,
        week: this.currentWeek,
        day: this.shared.currentDay.getValue(),
        topics: this.SelectedTopics
      }).subscribe((res: CurrentReportRes) => {
        if (res.success) {
          this.CurrentReport = res;
          console.log('Today Report:', res.today_report);
          console.log('Topic Wise Report:', res.topic_wise_report);
        }
      });
    }
  }

  NextQuestion(): void {
    if (this.AllQuestion.length === 0) return;

    this.i = (this.i + 1) % this.AllQuestion.length;
    this.CurrentQuestion = this.AllQuestion[this.i];
    this.QuestionType = this.CurrentQuestion?.question_type || '';

    console.log('Current Question:', this.CurrentQuestion);
    this.getCurrentReport()
  }

  private getEmptyQuestion(): QuestionData {
    return {
      Answer: '',
      OptionA: '',
      OptionB: '',
      OptionC: '',
      OptionD: '',
      Question: '',
      instruction: '',
      class: '',
      day: '',
      id: 0,
      incomplete_word: '',
      listen_rec: '',
      listen_word: '',
      question_Img: '',
      question_type: '',
      sections: '',
      sub_topics: '',
      topics: '',
      unit: '',
      week: '',
      video_url_youtube: '',
      video_url_local: ''
    };
  }

  private getEmptyReport(): CurrentReportRes {
    return {
      success: 0,
      today_report: {
        total: 0,
        correct: 0,
        incorrect: 0,
        correct_percent: 0,
        incorrect_percent: 0
      },
      topic_wise_report: {
        total: 0,
        correct: 0,
        incorrect: 0,
        correct_percent: 0,
        incorrect_percent: 0
      }
    };
  }

  setDefaultImage(event: any) {
    event.target.src = '../../../assets/icon/profile.jpeg';
  }

}
