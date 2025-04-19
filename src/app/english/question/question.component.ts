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
    week: ''
  }
  // CurrentQuestion = {
  //   "id": 9,
  //   "Question": "Please completed the word ?",
  //   "Answer": "E",
  //   "OptionA": "A",
  //   "OptionB": "S",
  //   "OptionC": "E",
  //   "OptionD": "N",
  //   "incomplete_word": "P__N",
  //   "question_type": "BlendWords",
  //   "question_Img": "uploads/2018-MAY-Six-Sites-for-Rhyme-Time-683x1024.png",
  //   "listen_rec": '',
  //   "listen_word": null,
  //   "class": "LKG",
  //   "unit": "1",
  //   "day": "1",
  //   "week": "3",
  //   "sections": "Grammar",
  //   "topics": "Noun",
  //   "sub_topics": "Abstract nouns"
  // }

  base_url: string = ''
  filledWord: string = '';
  audio: HTMLAudioElement | null = null;


  // for report 
  topicsRightPro: number = 0
  topicsWorngPro: number = 0

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
  }

  ngOnInit() {
    this._crud.getQuestion().subscribe(
      (res: QuestionData) => {
        console.log(res);
        if (Array.isArray(res)) {
          this.AllQuestion = res.reverse()
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


  selectOption(option: string) {
    this.filledWord = option;
    console.log(this.filledWord)
    this.isSaveVisible = true
  }

  resetSelection() {
    this.filledWord = '';
  }




  NextQuestion() {
    this.filledWord = ''
    if (this.i < this.AllQuestion.length - 1) {
      this.i++;
    } else {
      this.i = 0;
    }
    this.CurrentQuestion = this.AllQuestion[this.i];
    this.QuestionType = this.CurrentQuestion.question_type
    console.log(this.CurrentQuestion)
  }

  CheckCorrect() {
    this.isSaveVisible = false
    if (this.QuestionType == 'BlendWords') {
      if (this.CurrentQuestion?.Answer == this.filledWord) {
        this.onCorrect()
      } else {
        this.onOops()
      }
    }

    if (this.QuestionType == 'MCQ') {
      if (this.CurrentQuestion?.Answer == this.filledWord) {
        this.onCorrect()
      } else {
        this.onOops()
      }
    }

  }



  onPlayRec(rec: string) {
    console.log(rec)
    const fullUrl = this.base_url + rec
    if (this.audio) {
      this.audio.pause();
    }
    this.audio = new Audio(fullUrl);
    this.audio.play();

    this.isSaveVisible = true
  }

  onCorrect() {
    const dilogclosed = this.dialog.open(CorrectBoxComponent, {
      disableClose: true,
      width: "40vw",
      height: "90vh"
    });

    dilogclosed.afterClosed().subscribe(
      (res) => {
        console.log(res)
        if (res == 'next') {
          this.NextQuestion()
        }
      }
    )
  }

  onOops() {
    const oopsDilog = this.dialog.open(OppsBoxComponent, {
      disableClose: true,
      width: "40vw",
      height: "90vh"
    });
    oopsDilog.afterClosed().subscribe(
      (res) => {
        console.log(res)
        if (res == 'next') {
          this.NextQuestion()
        }

      }
    )

  }



}
