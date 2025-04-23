import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { QuestionData } from 'src/app/interface/Question.interface';
import { CorrectBoxComponent } from '../../correct-box/correct-box.component';
import { OppsBoxComponent } from '../../opps-box/opps-box.component';
import { CRUDService } from 'src/app/crud.service';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-blend-words',
  templateUrl: './blend-words.component.html',
  styleUrls: ['./blend-words.component.scss']
})
export class BlendWordsComponent {
  @Input() CurrentQuestion!: QuestionData;
  base_url: string = '';
  filledWord: string = '';
  isSaveVisible = false;

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
