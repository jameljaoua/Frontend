import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoryDetails } from './subcategory-details';

describe('SubcategoryDetails', () => {
  let component: SubcategoryDetails;
  let fixture: ComponentFixture<SubcategoryDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubcategoryDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubcategoryDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
