import { Component, Input } from '@angular/core';
import { QuestionData } from 'src/app/interface/Question.interface';
import { OppsBoxComponent } from '../../opps-box/opps-box.component';
import { MatDialog } from '@angular/material/dialog';
import { CRUDService } from 'src/app/crud.service';
import { SharedService } from 'src/app/shared.service';
import { CorrectBoxComponent } from '../../correct-box/correct-box.component';

@Component({
  selector: 'app-mcq',
  templateUrl: './mcq.component.html',
  styleUrls: ['./mcq.component.scss']
})
export class MCQComponent {
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
          this.shared.CurrentQuestionStatus.next(true)
        }

      }
    )

  }


  selectOption(option: string) {
    this.filledWord = option;
    console.log(this.filledWord)
    this.isSaveVisible = true
  }

  resetSelection() {
    
    this.filledWord = '';
  }
}
