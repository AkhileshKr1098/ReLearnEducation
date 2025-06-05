import { ThisReceiver } from '@angular/compiler';
import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CRUDService } from 'src/app/crud.service';
import { Class, ClassRes, Day, Sections, SubTopic, Topics, TopicsRes, Week } from 'src/app/interface/Question.interface';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent {
  questionIMG: any = '../../../../assets/icon/questionimg.jpg'
  questionFile: any
  sections: Sections[] = []
  Classes: Class[] = []
  weeks: Week[] = []
  days: Day[] = []
  topics: Topics[] = []
  subTopics: SubTopic[] = []
  units: any[] = []

  QuestionForm!: FormGroup;
  questionType: string = '';

  audioURL: string | null = null;
  audio: HTMLAudioElement | null = null;
  listen_rec: any
  selectedTab: 'local' | 'youtube' = 'local';
  localVideoUrl: string | null = null;
  youtubeUrl: string = '';
  VideoFile: any;
  validYoutubeUrl: SafeResourceUrl | null = null;

  constructor(
    private _fb: FormBuilder,
    private _crud: CRUDService,
    private matref: MatDialogRef<AddQuestionComponent>,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public edit_data: any,
    private sanitizer: DomSanitizer
  ) {
    this.QuestionForm = this._fb.group({
      class: ['', Validators.required],
      week: ['', Validators.required],
      day: ['', Validators.required],
      sections: ['', Validators.required],
      topics: ['', Validators.required],
      sub_topics: ['', Validators.required],
      unit: ['', Validators.required],
      question_type: ['', Validators.required],
      Question: ['', Validators.required],
      instruction: [''],
      OptionA: [''],
      OptionB: [''],
      OptionC: [''],
      OptionD: [''],
      Answer: [''],
      incomplete_word: [''],
      id: [''],
      listen_word: [''],
      listen_rec: [],
      video_url: [''],
      LetterMatch: this._fb.array([this.createOptionRow()])

    });
  }

  ngOnInit() {
    this.getClass()
    this.getWeeks()
    this.getDayS()
    this.getTopics()
    this.getSubTopics()
    this.getSection()
    this.getUnit()

    if (this.edit_data) {
      this.questionType = this.edit_data.question_type;
      if (this.edit_data.question_type === 'MCQ') {
        console.log(this.edit_data)
        this.QuestionForm.patchValue(this.edit_data);
        if (this.edit_data.video_url_youtube) {
          this.youtubeUrl = this.edit_data.video_url_youtube
        }
        if (this.edit_data.video_url_local) {
          this.localVideoUrl = this.edit_data.video_url_local
        }

      }

      if (this.edit_data.question_type === "LetterMatch") {
        console.log(this.edit_data);
        this.options.clear();
        this.QuestionForm.patchValue(this.edit_data)
        const optionAValues = this.edit_data.OptionA.split(', ');
        const optionBValues = this.edit_data.OptionB.split(', ');

        // Loop through data and push into form array
        optionAValues.forEach((optionA: any, index: any) => {
          this.options.push(
            this._fb.group({
              OptionA: [optionA],
              OptionB: [optionBValues[index] || ''],
            })
          );
        });
      }

      if (this.edit_data.question_type === "BlendWords") {
        console.log(this.edit_data);
        this.QuestionForm.patchValue(this.edit_data)
        this.questionIMG = this._crud.base_url + this.edit_data.question_Img
      }

      if (this.edit_data.question_type === "ListenWords") {
        console.log(this.edit_data);
        this.QuestionForm.patchValue(this.edit_data)
        this.questionIMG = this._crud.base_url + this.edit_data.question_Img
        this.audioURL = this._crud.base_url + this.edit_data.listen_rec
      }

      if (this.edit_data.question_type === "LetterTracing") {
        console.log(this.edit_data);
        this.QuestionForm.patchValue(this.edit_data)
      }

    }
  }


  // for defult type 
  getClass() {
    this._crud.getClass().subscribe(
      (res: ClassRes) => {
        if (Array.isArray(res.data)) {
          this.Classes = res.data
        }
      }
    )
  }

  getWeeks() {
    this._crud.getWeek().subscribe(
      (res) => {
        if (Array.isArray(res.data)) {
          this.weeks = res.data
        }
      }
    )
  }

  getDayS() {
    this._crud.getDays().subscribe(
      (res) => {
        if (Array.isArray(res.data)) {
          this.days = res.data
        }
      }
    )
  }

  getSection() {
    this._crud.getsections().subscribe(
      (res) => {
        if (Array.isArray(res.data)) {
          this.sections = res.data
        }
      }
    )
  }

  getTopics() {
    this._crud.getTopics().subscribe(
      (res: TopicsRes) => {
        if (Array.isArray(res.data)) {
          this.topics = res.data
        }
      }
    )
  }

  getSubTopics() {
    this._crud.getSubTopics().subscribe(
      (res) => {
        if (Array.isArray(res.data)) {
          this.subTopics = res.data
        }
      }
    )
  }

  getUnit() {
    this._crud.getUnit().subscribe(
      (res) => {
        this.units = Array.isArray(res.data) ? res.data : [];
      }
    )
  }

  onQuestionTypeChange(event: any) {
    this.questionType = event.target.value;
    this.cdr.detectChanges();
  }


  submitForm() {
    if (this.QuestionForm.invalid) {
      alert('Please fill all the requred filds ..!')
      return
    }

    if (this.questionType === 'MCQ') {
      const formValue = this.QuestionForm.value;
      const formData = new FormData();

      // Include ID only if it's present (used by backend to decide insert/update)
      if (formValue.id) formData.append('id', formValue.id);

      // Append all form fields
      formData.append('question_type', formValue.question_type || '');
      formData.append('Question', formValue.Question || '');
      formData.append('instruction', formValue.instruction || '');
      formData.append('OptionA', formValue.OptionA || '');
      formData.append('OptionB', formValue.OptionB || '');
      formData.append('OptionC', formValue.OptionC || '');
      formData.append('OptionD', formValue.OptionD || '');
      formData.append('Answer', formValue.Answer || '');
      formData.append('class', formValue.class || '');
      formData.append('week', formValue.week || '');
      formData.append('day', formValue.day || '');
      formData.append('sections', formValue.sections || '');
      formData.append('topics', formValue.topics || '');
      formData.append('sub_topics', formValue.sub_topics || '');
      formData.append('unit', formValue.unit || '');
      formData.append('incomplete_word', formValue.incomplete_word || '');
      formData.append('listen_rec', formValue.listen_rec || '');
      formData.append('listen_word', formValue.listen_word || '');
      formData.append('video_url_youtube', this.youtubeUrl || '');

      // Handle video file if present
      if (this.VideoFile) {
        formData.append('video_url_local', this.VideoFile);
      }

      this._crud.addQuestion(formData).subscribe(
        (res: any) => {
          alert(res.message);
          this.resetForm();

          if (res.success == 1) {
            // Optional close dialog or reload
            // this.matref.close(1);
          }
        },
        (err) => {
          console.error('Error submitting form:', err);
        }
      );
    }


    if (this.questionType == 'LetterTracing') {
     const formValue = this.QuestionForm.value;
      const formData = new FormData();

      // Include ID only if it's present (used by backend to decide insert/update)
      if (formValue.id) formData.append('id', formValue.id);

      // Append all form fields
      formData.append('question_type', formValue.question_type || '');
      formData.append('Question', formValue.Question || '');
      formData.append('instruction', formValue.instruction || '');
      formData.append('OptionA', formValue.OptionA || '');
      formData.append('OptionB', formValue.OptionB || '');
      formData.append('OptionC', formValue.OptionC || '');
      formData.append('OptionD', formValue.OptionD || '');
      formData.append('Answer', formValue.Answer || '');
      formData.append('class', formValue.class || '');
      formData.append('week', formValue.week || '');
      formData.append('day', formValue.day || '');
      formData.append('sections', formValue.sections || '');
      formData.append('topics', formValue.topics || '');
      formData.append('sub_topics', formValue.sub_topics || '');
      formData.append('unit', formValue.unit || '');
      formData.append('incomplete_word', formValue.incomplete_word || '');
      formData.append('listen_rec', formValue.listen_rec || '');
      formData.append('listen_word', formValue.listen_word || '');
      formData.append('video_url_youtube', this.youtubeUrl || '');

      // Handle video file if present
      if (this.VideoFile) {
        formData.append('video_url_local', this.VideoFile);
      }

      this._crud.addQuestion(formData).subscribe(
        (res: any) => {
          alert(res.message);
          this.resetForm();

          if (res.success == 1) {
            // Optional close dialog or reload
            // this.matref.close(1);
          }
        },
        (err) => {
          console.error('Error submitting form:', err);
        }
      );
    }

    if (this.questionType == 'LetterMatch') {
      const formData = {
        OptionA: this.options.value.map((row: any) => row.OptionA).join(', '),
        OptionB: this.options.value.map((row: any) => row.OptionB).join(', '),
        Question: this.QuestionForm.get('Question')?.value,
        instruction: this.QuestionForm.get('instruction')?.value,
        question_type: this.QuestionForm.get('question_type')?.value,
        class: this.QuestionForm.get('class')?.value,
        week: this.QuestionForm.get('week')?.value,
        day: this.QuestionForm.get('day')?.value,
        sections: this.QuestionForm.get('sections')?.value,
        topics: this.QuestionForm.get('topics')?.value,
        sub_topics: this.QuestionForm.get('sub_topics')?.value,
        unit: this.QuestionForm.get('unit')?.value,

      };

      console.log(formData)

      this._crud.addQuestion(formData).subscribe(
        (res) => {
          console.log(res)
          alert(res.message)
          this.resetForm()
        }
      );
    }


    if (this.questionType == 'BlendWords') {
      const fromdata = new FormData()
      fromdata.append('class', this.QuestionForm.get('class')?.value)
      fromdata.append('week', this.QuestionForm.get('week')?.value)
      fromdata.append('day', this.QuestionForm.get('day')?.value)
      fromdata.append('sections', this.QuestionForm.get('sections')?.value)
      fromdata.append('topics', this.QuestionForm.get('topics')?.value)
      fromdata.append('sub_topics', this.QuestionForm.get('sub_topics')?.value)
      fromdata.append('unit', this.QuestionForm.get('unit')?.value)
      fromdata.append('question_type', this.QuestionForm.get('question_type')?.value)
      fromdata.append('Question', this.QuestionForm.get('Question')?.value)
      fromdata.append('instruction', this.QuestionForm.get('instruction')?.value)
      fromdata.append('OptionA', this.QuestionForm.get('OptionA')?.value)
      fromdata.append('OptionB', this.QuestionForm.get('OptionB')?.value)
      fromdata.append('OptionC', this.QuestionForm.get('OptionC')?.value)
      fromdata.append('OptionD', this.QuestionForm.get('OptionD')?.value)
      fromdata.append('Answer', this.QuestionForm.get('Answer')?.value)
      fromdata.append('incomplete_word', this.QuestionForm.get('incomplete_word')?.value)
      fromdata.append('question_Img', this.questionFile)
      fromdata.append('video_url_youtube', this.youtubeUrl || '');

      // Handle video file if present
      if (this.VideoFile) {
        fromdata.append('video_url_local', this.VideoFile);
      }


      this._crud.addQuestion_picktheblend(fromdata).subscribe(
        (res: any) => {
          console.log(res)
          alert(res.message);
          this.resetForm()

        }
      )
    }


    if (this.questionType == 'ListenWords') {
      const fromdata = new FormData()
      fromdata.append('class', this.QuestionForm.get('class')?.value)
      fromdata.append('week', this.QuestionForm.get('week')?.value)
      fromdata.append('day', this.QuestionForm.get('day')?.value)
      fromdata.append('sections', this.QuestionForm.get('sections')?.value)
      fromdata.append('topics', this.QuestionForm.get('topics')?.value)
      fromdata.append('sub_topics', this.QuestionForm.get('sub_topics')?.value)
      fromdata.append('unit', this.QuestionForm.get('unit')?.value)
      fromdata.append('question_type', this.QuestionForm.get('question_type')?.value)
      fromdata.append('Question', this.QuestionForm.get('Question')?.value)
      fromdata.append('instruction', this.QuestionForm.get('instruction')?.value)
      fromdata.append('Answer', this.QuestionForm.get('Answer')?.value)
      fromdata.append('listen_word', this.QuestionForm.get('listen_word')?.value)
      fromdata.append('listen_rec', this.listen_rec)
      fromdata.append('question_Img', this.questionFile)
      fromdata.append('video_url_youtube', this.youtubeUrl || '');

      // Add video file if present
      if (this.VideoFile) {
        fromdata.append('video_url_local', this.VideoFile);
      }

      this._crud.addQuestion_listen(fromdata).subscribe(
        (res: any) => {
          console.log(res)
          alert(res.message)
          this.resetForm()

        }
      )
    }


    if (this.questionType == 'VideosType') {
      const fromdata = new FormData()
      fromdata.append('class', this.QuestionForm.get('class')?.value)
      fromdata.append('week', this.QuestionForm.get('week')?.value)
      fromdata.append('day', this.QuestionForm.get('day')?.value)
      fromdata.append('sections', this.QuestionForm.get('sections')?.value)
      fromdata.append('topics', this.QuestionForm.get('topics')?.value)
      fromdata.append('sub_topics', this.QuestionForm.get('sub_topics')?.value)
      fromdata.append('unit', this.QuestionForm.get('unit')?.value)
      fromdata.append('question_type', this.QuestionForm.get('question_type')?.value)
      fromdata.append('Question', this.QuestionForm.get('Question')?.value)
      fromdata.append('instruction', this.QuestionForm.get('instruction')?.value)
      fromdata.append('Answer', this.QuestionForm.get('Answer')?.value)
      fromdata.append('listen_word', this.youtubeUrl)
      fromdata.append('listen_rec', this.listen_rec)
      fromdata.append('question_Img', '')

      this._crud.video_type_question(fromdata).subscribe(
        (res: any) => {
          console.log(res)
          alert(res.message)
          this.resetForm()

        }
      )
    }


  }

  updateForm() {
    if (this.questionType === 'MCQ') {
      const formValue = this.QuestionForm.value;

      const formData = new FormData();

      // Append all fields to formData
      if (formValue.id) formData.append('id', formValue.id);

      formData.append('question_type', formValue.question_type || '');
      formData.append('Question', formValue.Question || '');
      formData.append('instruction', formValue.instruction || '');
      formData.append('OptionA', formValue.OptionA || '');
      formData.append('OptionB', formValue.OptionB || '');
      formData.append('OptionC', formValue.OptionC || '');
      formData.append('OptionD', formValue.OptionD || '');
      formData.append('Answer', formValue.Answer || '');
      formData.append('class', formValue.class || '');
      formData.append('week', formValue.week || '');
      formData.append('day', formValue.day || '');
      formData.append('sections', formValue.sections || '');
      formData.append('topics', formValue.topics || '');
      formData.append('sub_topics', formValue.sub_topics || '');
      formData.append('unit', formValue.unit || '');
      formData.append('incomplete_word', formValue.incomplete_word || '');
      formData.append('listen_rec', formValue.listen_rec || '');
      formData.append('listen_word', formValue.listen_word || '');
      formData.append('video_url_youtube', this.youtubeUrl || '');

      // Add video file if present
      if (this.VideoFile) {
        formData.append('video_url_local', this.VideoFile);
      }

      console.log('FormData to be sent:', formData);

      this._crud.addQuestion(formData).subscribe(
        (res: any) => {
          alert(res.message);
          this.resetForm();
        },
        (err) => {
          console.error('Error saving question:', err);
        }
      );
    }



    if (this.questionType == 'LetterTracing') {
     const formValue = this.QuestionForm.value;
      const formData = new FormData();

      // Include ID only if it's present (used by backend to decide insert/update)
      if (formValue.id) formData.append('id', formValue.id);

      // Append all form fields
      formData.append('question_type', formValue.question_type || '');
      formData.append('Question', formValue.Question || '');
      formData.append('instruction', formValue.instruction || '');
      formData.append('OptionA', formValue.OptionA || '');
      formData.append('OptionB', formValue.OptionB || '');
      formData.append('OptionC', formValue.OptionC || '');
      formData.append('OptionD', formValue.OptionD || '');
      formData.append('Answer', formValue.Answer || '');
      formData.append('class', formValue.class || '');
      formData.append('week', formValue.week || '');
      formData.append('day', formValue.day || '');
      formData.append('sections', formValue.sections || '');
      formData.append('topics', formValue.topics || '');
      formData.append('sub_topics', formValue.sub_topics || '');
      formData.append('unit', formValue.unit || '');
      formData.append('incomplete_word', formValue.incomplete_word || '');
      formData.append('listen_rec', formValue.listen_rec || '');
      formData.append('listen_word', formValue.listen_word || '');
      formData.append('video_url_youtube', this.youtubeUrl || '');

      // Handle video file if present
      if (this.VideoFile) {
        formData.append('video_url_local', this.VideoFile);
      }

      this._crud.addQuestion(formData).subscribe(
        (res: any) => {
          alert(res.message);
          this.resetForm();

          if (res.success == 1) {
            // Optional close dialog or reload
            // this.matref.close(1);
          }
        },
        (err) => {
          console.error('Error submitting form:', err);
        }
      );
    }

    if (this.questionType == 'LetterMatch') {

      const formData = {
        OptionA: this.options.value.map((row: any) => row.OptionA).join(', '),
        OptionB: this.options.value.map((row: any) => row.OptionB).join(', '),
        Question: this.QuestionForm.get('Question')?.value,
        OptionC: '.',
        OptionD: '.',
        Answer: '.',
        instruction: this.QuestionForm.get('instruction')?.value,
        question_type: this.QuestionForm.get('question_type')?.value,
        class: this.QuestionForm.get('class')?.value,
        week: this.QuestionForm.get('week')?.value,
        day: this.QuestionForm.get('day')?.value,
        sections: this.QuestionForm.get('sections')?.value,
        topics: this.QuestionForm.get('topics')?.value,
        sub_topics: this.QuestionForm.get('sub_topics')?.value,
        unit: this.QuestionForm.get('unit')?.value,
        id: this.QuestionForm.get('id')?.value,

      };

      console.log(formData)

      this._crud.QuestionUpdate(formData).subscribe(
        (res) => {
          console.log(res)
          this.resetForm()
        }
      );
    }

    if (this.questionType == 'BlendWords') {
      const fromdata = new FormData()

      fromdata.append('id', this.QuestionForm.get('id')?.value)
      fromdata.append('class', this.QuestionForm.get('class')?.value)
      fromdata.append('week', this.QuestionForm.get('week')?.value)
      fromdata.append('day', this.QuestionForm.get('day')?.value)
      fromdata.append('sections', this.QuestionForm.get('sections')?.value)
      fromdata.append('topics', this.QuestionForm.get('topics')?.value)
      fromdata.append('sub_topics', this.QuestionForm.get('sub_topics')?.value)
      fromdata.append('unit', this.QuestionForm.get('unit')?.value)
      fromdata.append('question_type', this.QuestionForm.get('question_type')?.value)
      fromdata.append('Question', this.QuestionForm.get('Question')?.value)
      fromdata.append('instruction', this.QuestionForm.get('instruction')?.value)
      fromdata.append('OptionA', this.QuestionForm.get('OptionA')?.value)
      fromdata.append('OptionB', this.QuestionForm.get('OptionB')?.value)
      fromdata.append('OptionC', this.QuestionForm.get('OptionC')?.value)
      fromdata.append('OptionD', this.QuestionForm.get('OptionD')?.value)
      fromdata.append('Answer', this.QuestionForm.get('Answer')?.value)
      fromdata.append('incomplete_word', this.QuestionForm.get('incomplete_word')?.value)

      if (this.questionFile) {
        fromdata.append('question_Img', this.questionFile)
      }
      fromdata.append('video_url_youtube', this.youtubeUrl || '');

      if (this.VideoFile) {
        fromdata.append('video_url_local', this.VideoFile);
      }

      this._crud.addQuestion_picktheblend(fromdata).subscribe(
        (res: any) => {
          console.log(res);
          this.resetForm()
          alert(res.message)

          if (res.status == 'success') {
            this.matref.close()
          }
        }
      )
    }


    if (this.questionType == 'ListenWords') {
      const fromdata = new FormData()
      fromdata.append('id', this.QuestionForm.get('id')?.value)
      fromdata.append('class', this.QuestionForm.get('class')?.value)
      fromdata.append('week', this.QuestionForm.get('week')?.value)
      fromdata.append('day', this.QuestionForm.get('day')?.value)
      fromdata.append('sections', this.QuestionForm.get('sections')?.value)
      fromdata.append('topics', this.QuestionForm.get('topics')?.value)
      fromdata.append('sub_topics', this.QuestionForm.get('sub_topics')?.value)
      fromdata.append('unit', this.QuestionForm.get('unit')?.value)
      fromdata.append('question_type', this.QuestionForm.get('question_type')?.value)
      fromdata.append('Question', this.QuestionForm.get('Question')?.value)
      fromdata.append('instruction', this.QuestionForm.get('instruction')?.value)
      fromdata.append('Answer', this.QuestionForm.get('Answer')?.value)
      fromdata.append('listen_word', this.QuestionForm.get('listen_word')?.value)
      fromdata.append('listen_rec', this.listen_rec)
      fromdata.append('question_Img', this.questionFile)
      fromdata.append('video_url_youtube', this.youtubeUrl || '');

      // Add video file if present
      if (this.VideoFile) {
        fromdata.append('video_url_local', this.VideoFile);
      }

      this._crud.addQuestion_listen(fromdata).subscribe(
        (res: any) => {
          console.log(res)
          alert(res.message)
          this.resetForm()
        }
      )
    }



  }

  get options() {
    return this.QuestionForm.get('LetterMatch') as FormArray;
  }

  createOptionRow(): FormGroup {
    return this._fb.group({
      OptionA: [''],
      OptionB: [''],
      Answer: ['']
    });
  }

  addRow() {
    if (this.options.length < 5) {
      this.options.push(this.createOptionRow());
    }
  }

  onFileChange(event: any) {
    this.questionFile = event.target.files[0];
    if (this.questionFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.questionIMG = reader.result;
      };
      reader.readAsDataURL(this.questionFile);
    }
  }

  onAudioChange(event: any) {
    this.listen_rec = event.target.files[0];
    if (this.listen_rec) {
      const reader = new FileReader();
      reader.onload = () => {
        this.audioURL = reader.result as string;
      };
      reader.readAsDataURL(this.listen_rec);
    }
  }

  playAudio() {
    if (this.audioURL) {
      if (this.audio) {
        this.audio.pause();
      }
      this.audio = new Audio(this.audioURL);
      this.audio.play();
    }
  }

  resetForm() {
    this.QuestionForm.get('Question')?.reset();
    this.QuestionForm.get('instruction')?.reset();
    this.QuestionForm.get('OptionA')?.reset();
    this.QuestionForm.get('OptionB')?.reset();
    this.QuestionForm.get('OptionC')?.reset();
    this.QuestionForm.get('OptionD')?.reset();
    this.QuestionForm.get('Answer')?.reset();
    this.QuestionForm.get('incomplete_word')?.reset();
    this.QuestionForm.get('listen_word')?.reset();
    this.QuestionForm.get('listen_rec')?.reset([]);
    this.QuestionForm.get('LetterMatch')?.reset();

  }



  onTabChange(tab: 'local' | 'youtube') {
    this.selectedTab = tab;
    this.localVideoUrl = null;
    this.validYoutubeUrl = null;
    this.youtubeUrl = '';
    this.VideoFile = ''
  }

  onLocalVideoSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      this.VideoFile = fileInput.files[0];
      this.localVideoUrl = URL.createObjectURL(file);
    }
  }



  onYoutubeUrlChanged() {
    const trimmedUrl = this.youtubeUrl.trim();
    if (trimmedUrl.startsWith('https://www.youtube.com/embed/')) {
      this.validYoutubeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(trimmedUrl);
    } else {
      this.validYoutubeUrl = null;
    }
  }

  // onYoutubeUrlChanged() {
  //   const trimmedUrl = this.youtubeUrl.trim();
  //   console.log(trimmedUrl);

  //   if (trimmedUrl.startsWith('https://www.youtube.com/embed/')) {
  //     console.log(trimmedUrl);

  //     this.validYoutubeUrl = trimmedUrl;
  //   } else {
  //     this.validYoutubeUrl = null;
  //   }
  // }
}
