import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPurchasedOrders } from './my-purchased-orders';

describe('MyPurchasedOrders', () => {
  let component: MyPurchasedOrders;
  let fixture: ComponentFixture<MyPurchasedOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPurchasedOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyPurchasedOrders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
