import { Component, AfterViewInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { CRUDService } from 'src/app/crud.service';
import { QuestionData } from 'src/app/interface/Question.interface';
import { UserData } from 'src/app/interface/student.interface';
import { SharedService } from 'src/app/shared.service';
import html2canvas from 'html2canvas';


interface Point {
  x: number;
  y: number;
}

interface Match {
  start: Point;
  end: Point;
  correct?: boolean;
  leftIndex: number;
  rightIndex: number;
  leftElement: HTMLElement;
  rightElement: HTMLElement;
}

@Component({
  selector: 'app-letter-match',
  templateUrl: './letter-match.component.html',
  styleUrls: ['./letter-match.component.scss']
})
export class LetterMatchComponent implements AfterViewInit {
  @Input() CurrentQyt!: QuestionData;
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

  leftWords: any[] = [];
  rightWords: any[] = [];
  matchedPairs: Match[] = [];
  totalQuestionMark: number = 0
  isDragging = false;
  dragLine = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } };

  selectedItem: { side: 'left' | 'right', item: any, element: HTMLElement } | null = null;
  outputMessage = new BehaviorSubject<number>(0)

  constructor(
    private dialog: MatDialog,
    private shared: SharedService,
    private _crud: CRUDService
  ) {

  }

  ngOnInit() {
    console.log('ngonint call')
    const updatedUserDataString = sessionStorage.getItem('rluser');
    console.log(updatedUserDataString);

    if (updatedUserDataString) {
      try {
        this.userData = JSON.parse(updatedUserDataString) as UserData;
        console.log('User data loaded:', this.userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }

  ngAfterViewInit() {
    console.log(this.CurrentQyt);

    setTimeout(() => {
      this.resetWords();
    });

  }

  shuffleArray(array: any[]) {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  resetWords() {
    if (!this.CurrentQyt || !this.CurrentQyt.OptionA || !this.CurrentQyt.OptionB) {
      console.warn('CurrentQyt or its properties are null/undefined');
      return;
    }

    const leftValue = this.CurrentQyt.OptionA.split(',').map(word => word.trim());
    const rightValue = this.CurrentQyt.OptionB.split(',').map(word => word.trim());

    this.leftWords = this.shuffleArray(leftValue.map(word => ({ word })));
    this.rightWords = this.shuffleArray(rightValue.map(word => ({ word })));

    this.clearMatches();
  }


  clearMatches() {
    this.isSave = false
    this.totalQuestionMark = 0
    this.matchedPairs = [];
    document.querySelectorAll('.word-item[data-side="left"], .word-item[data-side="right"]').forEach(el => {
      (el as HTMLElement).style.backgroundColor = '#f8f8f8';
      (el as HTMLElement).style.color = '#000';
    });
  }

  getElementAnchor(el: HTMLElement, side: 'left' | 'right'): Point {
    const rect = el.getBoundingClientRect();
    const container = document.querySelector('.word-match-wrapper') as HTMLElement;
    const containerRect = container.getBoundingClientRect();

    return {
      x: side === 'left' ? rect.right - containerRect.left : rect.left - containerRect.left,
      y: rect.top + rect.height / 2 - containerRect.top
    };
  }

  startDrag(item: any, side: 'left' | 'right', event: MouseEvent | TouchEvent) {
    if (this.isDragging) return;

    const target = event.currentTarget as HTMLElement;
    const index = Number(target.getAttribute('data-id'));

    this.selectedItem = { side, item, element: target };
    this.isDragging = true;

    const touch = (event instanceof TouchEvent) ? event.touches[0] : event;
    const anchor = this.getElementAnchor(target, side);
    this.dragLine.start = { ...anchor };
    this.dragLine.end = { x: touch.pageX, y: touch.pageY };

    event.stopPropagation();
    event.preventDefault();
  }

  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      const container = document.querySelector('.word-match-wrapper') as HTMLElement;
      const containerRect = container.getBoundingClientRect();
      this.dragLine.end = {
        x: event.clientX - containerRect.left,
        y: event.clientY - containerRect.top
      };
    }
  }

  onTouchMove(event: TouchEvent) {
    if (this.isDragging && event.touches.length > 0) {
      const touch = event.touches[0];
      const container = document.querySelector('.word-match-wrapper') as HTMLElement;
      const containerRect = container.getBoundingClientRect();
      this.dragLine.end = {
        x: touch.clientX - containerRect.left,
        y: touch.clientY - containerRect.top
      };
    }
  }

  onMouseUp(event: MouseEvent) {
    this.completeDrag(event.target as HTMLElement);
  }

  onTouchEnd(event: TouchEvent) {
    if (!this.isDragging || !this.selectedItem) return;
    const touch = event.changedTouches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement;
    this.completeDrag(target);
  }

  completeDrag(target: HTMLElement) {
    if (!this.isDragging || !this.selectedItem || !target || !target.classList.contains('word-item')) return;
    this.playAudio('../../../../assets/audio/linematchtime.wav');

    const selectedItem = this.selectedItem;
    const targetSide = target.getAttribute('data-side') as 'left' | 'right';
    const targetIndex = Number(target.getAttribute('data-id'));
    const selectedIndex = Number(selectedItem.element.getAttribute('data-id'));

    if (targetSide && targetSide !== selectedItem.side) {
      this.matchedPairs = this.matchedPairs.filter(match =>
        !(match.leftIndex === (selectedItem.side === 'left' ? selectedIndex : targetIndex) ||
          match.rightIndex === (selectedItem.side === 'right' ? selectedIndex : targetIndex))
      );

      const leftEl = selectedItem.side === 'left' ? selectedItem.element : target;
      const rightEl = selectedItem.side === 'right' ? selectedItem.element : target;

      this.matchedPairs.push({
        start: this.getElementAnchor(leftEl, 'left'),
        end: this.getElementAnchor(rightEl, 'right'),
        leftIndex: selectedItem.side === 'left' ? selectedIndex : targetIndex,
        rightIndex: selectedItem.side === 'right' ? selectedIndex : targetIndex,
        leftElement: leftEl,
        rightElement: rightEl
      });
    }

    this.resetDrag();
  }


  resetDrag() {
    this.isDragging = false;
    this.selectedItem = null;
  }

  isSave: boolean = false;
  TotalPercentage = 0;

  saveMatches(type: string) {
    if (type === 'submit') {
      this.isSave = false;
      this.shared.CurrentQuestionStatus.next(true)
      this.resetWords()
      this.clearMatches()
      console.log(this.totalQuestionMark);
    }

    if (type === 'save') {
      if (!this.CurrentQyt.OptionA) {
        return;
      }

      this.playAudio('../../../../assets/audio/answersavetime.wav');

      let correctCount = 0;
      let incorrectCount = 0;
      this.totalQuestionMark = 0
      for (const match of this.matchedPairs) {
        const leftWord = this.leftWords[match.leftIndex].word.trim().toLowerCase();
        const rightWord = this.rightWords[match.rightIndex].word.trim().toLowerCase();
        const correct = leftWord === rightWord;
        match.correct = correct;

        if (correct) {
          correctCount++;
          this.totalQuestionMark++;
          match.leftElement.style.backgroundColor = '#affab0';
          match.leftElement.style.color = '#000';
          match.rightElement.style.backgroundColor = '#affab0';
          match.rightElement.style.color = '#000';
        } else {
          incorrectCount++;
          this.totalQuestionMark++;
          match.leftElement.style.backgroundColor = '#fcb1b1';
          match.leftElement.style.color = '#000';
          match.rightElement.style.backgroundColor = '#fcb1b1';
          match.rightElement.style.color = '#000';
        }
      }

      // for completd or not
      const leftValue = this.CurrentQyt.OptionA.split(',').map(word => word.trim());
      if (leftValue.length > 0) {
        console.log('total left valuee', leftValue.length);
        console.log(this.totalQuestionMark, 'totalQuestionMark');


        if (this.totalQuestionMark !== leftValue.length) {
          alert('please completd the all ')
          return
        }
      }

      // for completd or not

      this.isSave = true;


      const total = correctCount + incorrectCount;

      this.TotalPercentage = total > 0 ? (correctCount / total) * 100 : 0;
      console.log(this.TotalPercentage, 'total')
      if (this.TotalPercentage === 100) {
        this.outputMessage.next(100)
      } else if (this.TotalPercentage >= 75) {
        this.outputMessage.next(75)
      } else if (this.TotalPercentage >= 50) {
        this.outputMessage.next(50)
      } else if (this.TotalPercentage >= 0) {
        this.outputMessage.next(0)
      } else {
        alert('No correct matches. Try again!');
      }

      console.log('action  value', this.outputMessage.getValue())

      setTimeout(() => {
        if (this.totalQuestionMark == 100) {
          console.log(' save call ')
          this.saveDivScreenshot(1)

        } else {
          console.log(' save call ')
          this.saveDivScreenshot(0)
        }
      }, 300)

    }
  }

  playAudio(url: string): void {
    const audio = new Audio(url);
    audio.play().catch(err => console.error('Failed to play audio:', err));
  }

  onCheck() {
    alert('Check feature not implemented yet.');
  }



  save(status: number) {
    console.log(this.userData);

    if (!this.userData.ID) {
      console.error('User ID not found. Cannot save answer.');
      return;
    }

    const answerData = {
      std_id: this.userData.ID,
      question_id: this.CurrentQyt.id,
      class: this.CurrentQyt.class,
      week: this.CurrentQyt.week,
      day: this.CurrentQyt.day,
      sections: this.CurrentQyt.sections,
      topics: this.CurrentQyt.topics,
      answer_status: status,
      teacher_id_fk: 0
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



  //  saveCanvas() {
  //   const canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
  //   // Wait a moment to ensure drawing is done (optional)
  //   setTimeout(() => {
  //     this.imageData = canvas.toDataURL("image/png");
  //     this.uploadToServer(this.imageData);
  //     this.onCorrect();
  //     this._shared.playAudio('../../../../assets/audio/answersavetime.wav');
  //   }, 100);
  // }



  saveDivScreenshot(status: any) {
    const divElement = document.querySelector('.word-match-wrapper') as HTMLElement;
    console.log(divElement);

    if (!divElement) return;
    setTimeout(() => {
      html2canvas(divElement).then(canvas => {
        const imageData = canvas.toDataURL('image/png');
        console.log(imageData);

        this.uploadToServer(imageData, status);

      });
    }, 100);
  }

  uploadToServer(imageBase64: string, status: any) {
    const byteCharacters = atob(imageBase64.split(',')[1]);
    const byteNumbers = Array.from(byteCharacters).map(c => c.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const imageBlob = new Blob([byteArray], { type: 'image/png' });
    const file = new File([imageBlob], 'uploaded_image.png', { type: 'image/png' });

    const formData = new FormData();
    formData.append('std_id', this.userData.ID);
    formData.append('question_id', `${this.CurrentQyt.id}`);
    formData.append('class', `${this.CurrentQyt.class}`);
    formData.append('week', `${this.CurrentQyt.week}`);
    formData.append('day', `${this.CurrentQyt.day}`);
    formData.append('sections', `${this.CurrentQyt.sections}`);
    formData.append('topics', `${this.CurrentQyt.topics}`);
    formData.append('answer_status', status);
    formData.append('answer_image', file);

    this._crud.Add_answers_api(formData).subscribe(
      (res) => console.log(res),
      (error) => console.error('Error uploading the image:', error)
    );
  }

}
