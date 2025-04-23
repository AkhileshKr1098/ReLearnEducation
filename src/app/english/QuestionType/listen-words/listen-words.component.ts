import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CRUDService } from 'src/app/crud.service';
import { QuestionData } from 'src/app/interface/Question.interface';
import { SharedService } from 'src/app/shared.service';
import { CorrectBoxComponent } from '../../correct-box/correct-box.component';
import { OppsBoxComponent } from '../../opps-box/opps-box.component';

@Component({
  selector: 'app-listen-words',
  templateUrl: './listen-words.component.html',
  styleUrls: ['./listen-words.component.scss']
})
export class ListenWordsComponent {
 @Input() CurrentQuestion!: QuestionData;
  base_url: string = '';
  filledWord: string = '';
  isSaveVisible = false;
  audio: HTMLAudioElement | null = null;

  constructor(
    private dialog: MatDialog,
    private _crud: CRUDService,
    private shared: SharedService
  ) {

    this._crud.img_base_url.subscribe(
        (res) => {
          this.base_url = res
        }
      )
    }
    selectOption(option: string) {
      this.filledWord = option;
      console.log(this.filledWord)
      this.isSaveVisible = true
    }
  
    CheckCorrect() {
      this.isSaveVisible = false
      if (this.CurrentQuestion?.Answer == this.filledWord) {
        this.resetSelection()
        this.onCorrect()
      } else {
        this.onOops()
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
            // this.NextQuestion()
            this.shared.CurrentQuestionStatus.next(true)
  
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
            // this.NextQuestion()
            this.shared.CurrentQuestionStatus.next(true)
          }
  
        }
      )
  
    }
  
  
    resetSelection() {
      this.filledWord = '';
    }
  
}
