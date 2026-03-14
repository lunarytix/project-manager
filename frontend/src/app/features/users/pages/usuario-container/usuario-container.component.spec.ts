import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioContainerComponent } from './usuario-container.component';

describe('UsuarioContainerComponent', () => {
  let component: UsuarioContainerComponent;
  let fixture: ComponentFixture<UsuarioContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
