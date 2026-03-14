import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarModuloComponent } from './eliminar-modulo.component';

describe('EliminarModuloComponent', () => {
  let component: EliminarModuloComponent;
  let fixture: ComponentFixture<EliminarModuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EliminarModuloComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EliminarModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
