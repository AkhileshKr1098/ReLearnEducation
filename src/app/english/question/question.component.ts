import { Component, ElementRef, ViewChild, AfterViewInit, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CRUDService } from 'src/app/crud.service';
import { ConfirmDialogComponent } from '../QuestionType/confirm-dialog/confirm-dialog.component';
import { CorrectBoxComponent } from '../correct-box/correct-box.component';
import { OppsBoxComponent } from '../opps-box/opps-box.component';
import { BehaviorSubject } from 'rxjs';
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
  QuestionType: string = ''
  SelectedTopics: string = ''
  AllQuestion: QuestionData[] = []
  CurrentQuestion: QuestionData = {
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
  }

  base_url: string = ''
  topicsRightPro: number = 0
  topicsWorngPro: number = 0
  CurrentReport: CurrentReportRes = {
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
  }
  userData: any
  day: any
  constructor(
    private _crud: CRUDService,
    private dialog: MatDialog,
    public shared: SharedService
  ) {
    this._crud.img_base_url.subscribe(
      (res) => {
        this.base_url = res
      }
    )

    this.userData = JSON.parse(sessionStorage.getItem('rluser') || '{}');
    this.SelectedTopics = sessionStorage.getItem('SelectedTopics') || '';
  }

  ngOnInit() {
    console.log(this.userData);

    const startingDate = new Date(this.userData.AsignDate);
    const currentDate = new Date();

    const timeDiff = currentDate.getTime() - startingDate.getTime();
    const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    const currentWeek = Math.floor(totalDays / 6);
    const currentDay = totalDays % 6;

    console.log('Total Days:', totalDays);
    console.log('Current Week:', currentWeek);
    console.log('Current Day:', currentDay);

    this._crud.getQuestionFilter(this.userData.Class, currentWeek, currentDay, this.userData.ID).subscribe(
      (res: QuestionDataRes) => {
        if (Array.isArray(res.data)) {
          this.AllQuestion = res.data
          // this.AllQuestion = res.reverse()
          // this.AllQuestion = res.reverse().slice(1, 7) // working mode
          console.log(this.AllQuestion)
          this.shared.AllQuestionList.next(res)
          this.CurrentQuestion = this.AllQuestion[this.i];
          this.QuestionType = this.CurrentQuestion.question_type
          this.NextQuestion()
        }
      }
    )


    this.shared.CurrentQuestionStatus.subscribe(
      (res) => {
        console.log(res);
        if (res === true) {
          this.NextQuestion()
        }
      }
    )

    this.getCurrentReport()
  }




  ngAfterViewInit() {
    console.log('afterviewunit call');

  }

  i = 0





  getCurrentReport() {
    this._crud.get_current_report({
      std_id: this.userData.ID,
      class: this.userData.Class,
      week: this.shared.currentWeek.getValue(),
      day: this.shared.currentDay.getValue(),
      topics: this.SelectedTopics
    }).subscribe(res => {
      if (res.success) {
        this.CurrentReport = res
        console.log('Today Report:', res.today_report);
        console.log('Topic Wise Report:', res.topic_wise_report);
      }
    });


  }

  NextQuestion() {
    if (this.i < this.AllQuestion.length - 1) {
      this.i++;
    } else {
      this.i = 0;
    }
    this.CurrentQuestion = this.AllQuestion[this.i];
    this.QuestionType = this.CurrentQuestion.question_type
    console.log(this.CurrentQuestion, 'CurrentQuestion')
  }

}
