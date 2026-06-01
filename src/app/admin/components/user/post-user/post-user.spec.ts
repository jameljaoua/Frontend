import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostUser } from './post-user';

describe('PostUser', () => {
  let component: PostUser;
  let fixture: ComponentFixture<PostUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
