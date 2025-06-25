import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CRUDService } from 'src/app/crud.service';
import { QuestionData } from 'src/app/interface/Question.interface';
import { UserData } from 'src/app/interface/student.interface';
import { SharedService } from 'src/app/shared.service';
import { CorrectBoxComponent } from '../../correct-box/correct-box.component';
import { OppsBoxComponent } from '../../opps-box/opps-box.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-video-type',
  templateUrl: './video-type.component.html',
  styleUrls: ['./video-type.component.scss']
})
export class VideoTypeComponent {
  @Input() CurrentQuestion!: QuestionData;

  base_url: string = '';
  isSaveVisible = false;

  userData: any = {};
  currentWeek: any = 0;
  currentDay: any = 0;

  safeUrl!: SafeResourceUrl;

  constructor(
    private dialog: MatDialog,
    private _crud: CRUDService,
    private shared: SharedService,
    private sanitizer: DomSanitizer
  ) {
    this.base_url = this.shared.base_url.getValue()
  }

  ngOnInit() {
    console.log(this.CurrentQuestion);

    this.userData = JSON.parse(sessionStorage.getItem('rluser') || '{}');
    this.currentWeek = this.shared.currentWeek.getValue();
    this.currentDay = this.shared.currentDay.getValue();

    if (this.CurrentQuestion?.listen_word) {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.CurrentQuestion.listen_word);
      console.log(this.safeUrl);

    }
  }


  CheckCorrect() {
    // this.save(1);
    this.CurrentQuestion.listen_rec = ''
    this.CurrentQuestion.listen_word = ''
    this.safeUrl = ''
    this.shared.CurrentQuestionStatus.next(true);

    setTimeout(() => {
      if (this.CurrentQuestion?.listen_word) {
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.CurrentQuestion.listen_word);
        console.log(this.safeUrl);

      }
    }, 100)
  }

  onCorrect() {
    const dialogClosed = this.dialog.open(CorrectBoxComponent, {
      disableClose: true,
      width: "40vw",
      height: "90vh"
    });

    dialogClosed.afterClosed().subscribe((res) => {
      console.log('Correct dialog closed with:', res);
      if (res === 'next') {
        this.shared.CurrentQuestionStatus.next(true);
      }
    });
  }

  onOops() {
    const oopsDialog = this.dialog.open(OppsBoxComponent, {
      disableClose: true,
      width: "40vw",
      height: "90vh"
    });

    oopsDialog.afterClosed().subscribe((res) => {
      console.log('Oops dialog closed with:', res);
      if (res === 'next') {
        this.shared.CurrentQuestionStatus.next(true);
      }
    });
  }



  save(status: number) {
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
      std_answer: 'Watch'
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
