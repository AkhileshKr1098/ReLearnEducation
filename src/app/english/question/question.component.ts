import { Component, ElementRef, ViewChild, AfterViewInit, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CRUDService } from 'src/app/crud.service';
import { ConfirmDialogComponent } from '../QuestionType/confirm-dialog/confirm-dialog.component';
import { CorrectBoxComponent } from '../correct-box/correct-box.component';
import { OppsBoxComponent } from '../opps-box/opps-box.component';
import { BehaviorSubject } from 'rxjs';
import { QuestionData } from 'src/app/interface/Question.interface';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, AfterViewInit {

  isSaveVisible = false;
  QuestionType: string = ''
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
  userLoginData = {
    name: 'MR. Json',
    age: 11,
    class: 'LKG',
    school: 'US, Publics school ',
    country: 'USA',
    profile_img: '../../../assets/icon/profile.jpeg',
    currentPoint: 350
  }
  userData: any
  day: any
  constructor(
    private _crud: CRUDService,
    private dialog: MatDialog,
    private shared: SharedService
  ) {
    this._crud.img_base_url.subscribe(
      (res) => {
        this.base_url = res
      }
    )

    this.userData = JSON.parse(sessionStorage.getItem('rluser') || '{}');
this.day = JSON.parse(sessionStorage.getItem('selectedDay') || '""');
  }

  ngOnInit() {
    console.log(this.userData);
    
    this._crud.getQuestionFilter(this.userLoginData.class, this.userData.Week, this.day, this.userData.ID).subscribe(
      (res: QuestionData) => {
        if (Array.isArray(res)) {
          // this.AllQuestion = res.slice(3, 7)
          this.AllQuestion = res.reverse()
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
  }




  ngAfterViewInit() {
    console.log('afterviewunit call');

  }

  i = 0







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
