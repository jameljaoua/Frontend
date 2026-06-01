import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadDetails } from './download-details';

describe('DownloadDetails', () => {
  let component: DownloadDetails;
  let fixture: ComponentFixture<DownloadDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
