import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloContainerComponent } from './modulo-container.component';

describe('ModuloContainerComponent', () => {
  let component: ModuloContainerComponent;
  let fixture: ComponentFixture<ModuloContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuloContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuloContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
