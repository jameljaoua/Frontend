import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSubcategories } from './show-subcategories';

describe('ShowSubcategories', () => {
  let component: ShowSubcategories;
  let fixture: ComponentFixture<ShowSubcategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowSubcategories]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowSubcategories);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
