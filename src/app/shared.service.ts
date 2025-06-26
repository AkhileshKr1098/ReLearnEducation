import { Injectable } from '@angular/core';
import { flush } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  userData = {
    AbacusMaster: "0.00",
    AsignDate: "2025-06-12",
    AsignDay: "1",
    CSDate: "2025-06-11",
    ContactNo: "6202572787",
    Course: "FT with Basics & MT",
    Currency: "",
    CustomWeek: "No",
    DOB: "2025-01-27",
    GameTimeInterval: "5",
    GraceDays: "0",
    Group1: "Junior",
    HolidayFrom: null,
    HolidayTo: null,
    ID: "5287",
    Level: "1",
    LittleChamp: "0.00",
    LittleLeap: "0.00",
    LittleMaster: "0.00",
    LittleProdigy: "0.00",
    LittleStart: "0.00",
    LoginId: "tech.kr.akhi@gmail.com",
    MaxQToDo: "100",
    Status: "Active",
    UserName: "Akhilesh Kumar",
    Validity: null,
    Week: "2",
    Class: "UKG",
    School: 'USDK PT SCH',
    Country: 'USA',
    narratorSpeed: null // or some actual value if needed
  };

  // Store in session storage
  LoginData: any
  constructor() {
    sessionStorage.setItem("rluser", JSON.stringify(this.userData));
    // console.log(t his.userData);
    this.WeekCalc()
  }

  base_url = new BehaviorSubject<string>('https://ud.mausamstudio.com/relearn_api/')
  base_url_ans_img = new BehaviorSubject<string>('https://ud.mausamstudio.com/relearn_api/uploads/ans_img/')
  base_url_audio = new BehaviorSubject<string>('')
  base_url_icon = new BehaviorSubject<string>('')
  base_url_answer = new BehaviorSubject<string>('')
  AllQuestionList = new BehaviorSubject<any>([])

  CurrentQuestionStatus = new BehaviorSubject<boolean>(false)

  playAudio(url: string): void {
    const audio = new Audio(url);
    audio.play().catch(err => console.error('Failed to play audio:', err));
  }


  day: any
  week: any
  asignWeek: any
  asignDays: any
  asignCSDay: any
  curDate: any

  currentWeek = new BehaviorSubject<number>(1)
  currentDay = new BehaviorSubject<number>(1)


  WeekCalc() {
    console.log(this.userData);
    let currentDate = new Date();
    let startDate = new Date(this.userData.CSDate);

    if (!isNaN(startDate.getTime())) {
      let timeDiff = currentDate.getTime() - startDate.getTime();
      let diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));

      let asignWeek = Number(this.asignWeek) || 0;
      let asignDays = Number(this.asignDays) || 0;
      let asignCSDay = Number(this.asignCSDay) || 0;
      let totalDays = diffDays + (asignWeek * 7) - 7 + asignDays + asignCSDay - 1;

      this.day = totalDays + 1;
      this.week = Math.ceil(this.day / 7);
      this.day = this.day - ((this.week - 1) * 7);

      console.log(this.week, 'week', this.day, 'day');
      this.currentWeek.next(this.week)
      this.currentDay.next(this.day)
    } else {
      console.error("Invalid CSDate:", this.userData.CSDate);
    }
  }
}
