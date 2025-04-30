import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPageDeatilsComponent } from './report-page-deatils.component';

describe('ReportPageDeatilsComponent', () => {
  let component: ReportPageDeatilsComponent;
  let fixture: ComponentFixture<ReportPageDeatilsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportPageDeatilsComponent]
    });
    fixture = TestBed.createComponent(ReportPageDeatilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
