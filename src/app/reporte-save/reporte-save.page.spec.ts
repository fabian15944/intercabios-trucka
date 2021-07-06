import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReporteSavePage } from './reporte-save.page';

describe('ReporteSavePage', () => {
  let component: ReporteSavePage;
  let fixture: ComponentFixture<ReporteSavePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteSavePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReporteSavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
