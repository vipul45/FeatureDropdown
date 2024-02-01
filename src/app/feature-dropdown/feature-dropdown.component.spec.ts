import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureDropdownComponent } from './feature-dropdown.component';

describe('FeatureDropdownComponent', () => {
  let component: FeatureDropdownComponent;
  let fixture: ComponentFixture<FeatureDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeatureDropdownComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FeatureDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
