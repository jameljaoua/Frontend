import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostSubcategory } from './post-subcategory';

describe('PostSubcategory', () => {
  let component: PostSubcategory;
  let fixture: ComponentFixture<PostSubcategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostSubcategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostSubcategory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
