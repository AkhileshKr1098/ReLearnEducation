import { Injectable } from '@angular/core';
import { flush } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  userData = {
    AbacusMaster: "0.00",
    AsignDate: "2025-01-27",
    AsignDay: "1",
    CSDate: "2025-01-27",
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
    narratorSpeed: null // or some actual value if needed
  };

  // Store in session storage

  constructor() {
    sessionStorage.setItem("rluser", JSON.stringify(this.userData));
    console.log(this.userData);

  }

  base_url = new BehaviorSubject<string>('https://ud.mausamstudio.com/relearn_api/')
  base_url_audio = new BehaviorSubject<string>('')
  base_url_icon = new BehaviorSubject<string>('')
  base_url_answer = new BehaviorSubject<string>('')
  AllQuestionList = new BehaviorSubject<any>([])

  CurrentQuestionStatus = new BehaviorSubject<boolean>(false)

  playAudio(url: string): void {
    const audio = new Audio(url);
    audio.play().catch(err => console.error('Failed to play audio:', err));
  }
}
