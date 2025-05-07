import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnsPriviewComponent } from './ans-priview.component';

describe('AnsPriviewComponent', () => {
  let component: AnsPriviewComponent;
  let fixture: ComponentFixture<AnsPriviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnsPriviewComponent]
    });
    fixture = TestBed.createComponent(AnsPriviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
