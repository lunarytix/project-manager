import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarModuloComponent } from './listar-modulo.component';

describe('ListarModuloComponent', () => {
  let component: ListarModuloComponent;
  let fixture: ComponentFixture<ListarModuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarModuloComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
