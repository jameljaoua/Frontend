import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOrderedProducts } from './view-ordered-products';

describe('ViewOrderedProducts', () => {
  let component: ViewOrderedProducts;
  let fixture: ComponentFixture<ViewOrderedProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewOrderedProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewOrderedProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
