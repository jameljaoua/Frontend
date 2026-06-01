import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCoupon } from './post-coupon';

describe('PostCoupon', () => {
  let component: PostCoupon;
  let fixture: ComponentFixture<PostCoupon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostCoupon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostCoupon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
