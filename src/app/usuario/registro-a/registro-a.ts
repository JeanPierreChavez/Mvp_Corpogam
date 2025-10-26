import { Component, OnInit } from '@angular/core';
import { DatePicker } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from "primeng/floatlabel"
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { FileUpload, FileUploadEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

interface Opciones {
  name: string;
  code: string;
}

@Component({
  selector: 'app-registro-a',
  imports: [FormsModule, DatePicker, FloatLabelModule, InputTextModule, Select,ButtonModule,FileUpload, ToastModule, CommonModule,HttpClientModule],
   providers: [MessageService],
  templateUrl: './registro-a.html',
  styleUrl: './registro-a.scss'
})
export class RegistroA implements OnInit {
  date: Date | undefined;

  value2: string | undefined;
  //Sexo 
  sexo: Opciones[] | undefined;

  seleccionesexo: Opciones | undefined;
  //Estados 
  estados: Opciones[] | undefined;

  seleccioneestado: Opciones | undefined;

  ngOnInit() {
    this.sexo = [
      { name: 'Macho', code: 'M' },
      { name: 'Hembra', code: 'H' },
    ];
    this.estados = [
      { name: 'Vivo', code: 'V' },
      { name: 'Muerto', code: 'M' },
      { name: 'Vendido', code: 'V' },
    ]
  }

   uploadedFiles: any[] = [];

    constructor(private messageService: MessageService) {}

   onUpload(event: FileUploadEvent) {
  for (let file of event.files) {
    this.uploadedFiles.push(file);
  }

  this.messageService.add({
    severity: 'info',
    summary: 'Éxito',
    detail: `${event.files.length} archivo(s) subido(s)`
  });
}

}
