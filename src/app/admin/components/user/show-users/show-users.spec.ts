import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowUsers } from './show-users';

describe('ShowUsers', () => {
  let component: ShowUsers;
  let fixture: ComponentFixture<ShowUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowUsers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
