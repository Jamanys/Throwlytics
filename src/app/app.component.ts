import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AnalysisComponent } from './analysis/analysis.component';
import { MatInputModule } from '@angular/material/input';

interface Entry {
  tourNumber: number;    // 1..7
  stepNumber: number;    // position dans le tour
  value: string;         // valeur attendue du tour
  buttonClicked: string; // bouton cliqué
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatSelectModule,
    AnalysisComponent // ton composant Analysis ici
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {

  maxEntries = 5;
  entries: Entry[] = [];
  examinerName: string = '';
  examineeName: string = '';
  meteoOptions: string[] = ['Sec','Humide','Mouillé'];
  ventOptions: string[] = ['Nul', 'Face','Face/Droite','Droite','Dos/Droite','Dos','Dos/Gauche','Gauche','Face/Gauche'];
  meteovalue: string = this.meteoOptions[0];
  ventvalue: string = this.ventOptions[0];
  tours = [
    // 5 tours longs
    ['5.5m tendu D', '7.5m lobed D', ' 7.5m tendu G', '10m lobed G', '10m rythmed D', '11.5m lobed G', '13m rythmed G', '15m rythmed D'],
    ['5.5m tendu G', '7.5m lobed G', ' 7.5m tendu D', '10m lobed D', '10m rythmed G', '11.5m lobed D', '13m rythmed D', '15m rythmed G'],
    ['5.5m tendu D', '7.5m lobed D', ' 7.5m tendu G', '10m lobed G', '10m rythmed D', '11.5m lobed G', '13m rythmed G', '15m rythmed D'],
    ['5.5m tendu G', '7.5m lobed G', ' 7.5m tendu D', '10m lobed D', '10m rythmed G', '11.5m lobed D', '13m rythmed D', '15m rythmed G'],
    ['5.5m tendu D', '7.5m lobed D', ' 7.5m tendu G', '10m lobed G', '10m rythmed D', '11.5m lobed G', '13m rythmed G', '15m rythmed D'],
    // 2 tours allégés
    ['5.5m tendu G','7.5m tendu D','10m Rythmed G','13m rythmed D','15m rythmed G'],
    ['5.5m tendu D','7.5m tendu G','10m Rythmed D','13m rythmed G','15m rythmed D'],
  ];
  currentTour: number = 0;
  currentStep: number = 0;

  onClick(button: string) {
    const tour = this.tours[this.currentTour];

    // Ignore si tour fini
    if (this.currentStep >= tour.length) return;

    // Ajouter l'entrée avec bouton cliqué
    this.entries.push({
      tourNumber: this.currentTour + 1,      // 1-based
      stepNumber: this.currentStep + 1,      // 1-based
      value: tour[this.currentStep],         // valeur attendue
      buttonClicked: button
    });

    this.currentStep++;

    // passer au tour suivant si fini
    if (this.currentStep >= tour.length && this.currentTour < this.tours.length - 1) {
      this.currentTour++;
      this.currentStep = 0;
    }
  }

reset() {
  // 🔁 Données de codage
  this.entries = [];

  // 👤 Identité
  this.examinerName = '';
  this.examineeName = '';

  // 🌦️ Conditions
  this.meteovalue = this.meteoOptions[0];
  this.ventvalue = this.ventOptions[0];

  // 🔄 Navigation exercice
  this.currentTour = 0;
  this.currentStep = 0;
}


  exportToCSV() {
    if (this.entries.length === 0) return;

    const headers = [
      "date", "examineeName", "examinerName", "tour", "step", "value", "buttonClicked", "meteo", "vent"
    ];

    const rows = this.entries.map(entry => {
      const date = new Date().toLocaleDateString('en-CA');
      return [
        date,
        this.examineeName,
        this.examinerName,
        entry.tourNumber,
        entry.stepNumber,
        entry.value,
        entry.buttonClicked,
        this.meteovalue,
        this.ventvalue
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'donnees_codage.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}


interface CsvEntry {
  date: string;
  examineeName: string;
  examinerName: string;
  tour: number;
  step: number;
  value: string;
  buttonClicked: string;
  meteo: string;
  vent: string;
}
