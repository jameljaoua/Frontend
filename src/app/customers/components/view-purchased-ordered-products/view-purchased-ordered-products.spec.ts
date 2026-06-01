import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPurchasedOrderedProducts } from './view-purchased-ordered-products';

describe('ViewPurchasedOrderedProducts', () => {
  let component: ViewPurchasedOrderedProducts;
  let fixture: ComponentFixture<ViewPurchasedOrderedProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPurchasedOrderedProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPurchasedOrderedProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
