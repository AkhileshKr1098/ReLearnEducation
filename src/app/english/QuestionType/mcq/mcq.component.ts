import { Component, Input, OnInit } from '@angular/core';
import { QuestionData } from 'src/app/interface/Question.interface';
import { OppsBoxComponent } from '../../opps-box/opps-box.component';
import { MatDialog } from '@angular/material/dialog';
import { CRUDService } from 'src/app/crud.service';
import { SharedService } from 'src/app/shared.service';
import { CorrectBoxComponent } from '../../correct-box/correct-box.component';
import { UserData } from 'src/app/interface/student.interface';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-mcq',
  templateUrl: './mcq.component.html',
  styleUrls: ['./mcq.component.scss']
})
export class MCQComponent implements OnInit {
  @Input() CurrentQuestion!: QuestionData;
  base_url: string = '';
  filledWord: string = '';
  isSaveVisible = false;
  safeUrl!: SafeResourceUrl;

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
    private dialog: MatDialog,
    private _crud: CRUDService,
    private shared: SharedService,
    private sanitizer: DomSanitizer

  ) {
    this._crud.img_base_url.subscribe(
      (res) => {
        this.base_url = res
      }
    )

    const updatedUserDataString = sessionStorage.getItem('rluser');
    if (updatedUserDataString) {
      try {
        this.userData = JSON.parse(updatedUserDataString) as UserData;
        console.log('User data loaded:', this.userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }
  ngOnInit(): void {

    setTimeout(() => {
      if (this.CurrentQuestion?.listen_word) {
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.CurrentQuestion.video_url);
        console.log(this.safeUrl);
      }
    }, 1000)
  }




  getVerify(url: any) {
    console.log(url);
    return this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }
  CheckCorrect() {
    this.isSaveVisible = false
    if (this.CurrentQuestion?.Answer == this.filledWord) {
      this.resetSelection()
      this.onCorrect()
      this.save(1)
    } else {
      this.onOops()
      this.save(0)
    }
  }



  onCorrect() {
    console.log(this.filledWord);
    const dilogclosed = this.dialog.open(CorrectBoxComponent, {
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

  save(status: number) {
    this.filledWord = ''
    if (!this.userData.ID) {
      console.error('User ID not found. Cannot save answer.');
      return;
    }

    const answerData = {
      std_id: this.userData.ID,
      question_id: this.CurrentQuestion.id,
      class: this.CurrentQuestion.class,
      week: this.CurrentQuestion.week,
      day: this.CurrentQuestion.day,
      sections: this.CurrentQuestion.sections,
      topics: this.CurrentQuestion.topics,
      answer_status: status,
      teacher_id_fk: 0,
      std_answer: this.filledWord
    };

    console.log('Saving answer:', answerData);

    this._crud.ans_save(answerData).subscribe(
      (response) => {
        console.log('Server response:', response);
        if (response.success) {
          console.log('Answer saved successfully!');
        } else {
          console.error('Server message:', response.message);
        }
      },
      (error) => {
        console.error('Error saving answer:', error);
        alert('Something went wrong while saving the answer!');
      }
    );
  }
}
