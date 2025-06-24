import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CRUDService } from 'src/app/crud.service';
import { AnswerWithQuestion, AnswerWithQuestionRes } from 'src/app/interface/Question.interface';
import { SharedService } from 'src/app/shared.service';

interface qdata {
  std_id: string,
  day: string,
  week: string
}
@Component({
  selector: 'app-ans-priview',
  templateUrl: './ans-priview.component.html',
  styleUrls: ['./ans-priview.component.scss']
})
export class AnsPriviewComponent implements OnInit {
  base_url: string = '';
  base_url_ans_img: string = '';
  AnsQuestionList: AnswerWithQuestion[] = []
  audio: HTMLAudioElement | null = null;

  constructor(
    private _crud: CRUDService,
    public _shared: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: qdata,

  ) {
    this._crud.img_base_url.subscribe(
      (res) => {
        this.base_url = res
      }
    )

    this._shared.base_url_ans_img.subscribe(
      (res)=>{
        this.base_url_ans_img = res
      }
    )
  }

  ngOnInit() {
    this.get_report(this.data.std_id, this.data.day, this.data.week)
  }

  get_report(std: string, day: string, week: string) {
    this._crud.ans_priview({
      std_id: std,
      day: day,
      week: week
    }).subscribe(
      (res: AnswerWithQuestionRes) => {
        console.log(res);
        if (Array.isArray(res.data)) {
          this.AnsQuestionList = res.data
        }

      }
    )
  }

  onPlayRec(rec: any) {
    console.log(rec)
    const fullUrl = this.base_url + rec
    if (this.audio) {
      this.audio.pause();
    }
    this.audio = new Audio(fullUrl);
    this.audio.play();
  }
}
