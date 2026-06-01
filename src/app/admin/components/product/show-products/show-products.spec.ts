import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowProducts } from './show-products';

describe('ShowProducts', () => {
  let component: ShowProducts;
  let fixture: ComponentFixture<ShowProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
