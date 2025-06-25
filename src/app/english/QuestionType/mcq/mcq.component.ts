import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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

  userData: any = {};
  currentWeek: any = 0;
  currentDay: any = 0;
  constructor(
    private dialog: MatDialog,
    private _crud: CRUDService,
    public shared: SharedService,
    private sanitizer: DomSanitizer

  ) {
    this._crud.img_base_url.subscribe(
      (res) => {
        this.base_url = res
      }
    )


    this.userData = JSON.parse(sessionStorage.getItem('rluser') || '{}');
    this.currentWeek = this.shared.currentWeek.getValue();
    this.currentDay = this.shared.currentDay.getValue();
  }
  ngOnInit(): void {

    setTimeout(() => {
      if (this.CurrentQuestion?.listen_word) {
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.CurrentQuestion.video_url_local);
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



  @ViewChild('videoElement') videoElementRef!: ElementRef;

  isPlaying = false;
  progress = 0;
  volume = 1;
  duration = 0;
  currentTime = 0;

  togglePlay() {
    const video: HTMLVideoElement = this.videoElementRef.nativeElement;
    if (video.paused) {
      video.play();
      this.isPlaying = true;
    } else {
      video.pause();
      this.isPlaying = false;
    }
  }

  onTimeUpdate() {
    const video = this.videoElementRef.nativeElement;
    this.progress = (video.currentTime / video.duration) * 100;
    this.currentTime = video.currentTime;
  }

  onLoadedMetadata() {
    const video = this.videoElementRef.nativeElement;
    this.duration = video.duration;
  }

  seekVideo(event: Event) {
    const input = event.target as HTMLInputElement;
    const video = this.videoElementRef.nativeElement;
    video.currentTime = (+input.value / 100) * video.duration;
  }

  changeVolume(event: Event) {
    const input = event.target as HTMLInputElement;
    const video = this.videoElementRef.nativeElement;
    video.volume = +input.value;
    this.volume = +input.value;
  }

  toggleMute() {
    const video = this.videoElementRef.nativeElement;
    video.muted = !video.muted;
  }

  toggleFullScreen(video: HTMLVideoElement) {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  }
}
