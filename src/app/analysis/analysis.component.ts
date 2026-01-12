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
import { MatInputModule } from '@angular/material/input';

interface CsvEntry {
  date: string;
  examineeName: string;
  examinerName: string;
  tour: number;
  step: number;
  value: string;
  meteo: string;
  vent: string;
  buttonClicked?: string; // si tu veux enregistrer Haut/Bas/…
}

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatTabsModule,
    MatIconModule,
    MatFormFieldModule,
    MatDividerModule,
    MatSelectModule,
  ],
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent {
  allEntries: CsvEntry[] = [];
  filteredEntries: CsvEntry[] = [];

  filters = {
  examiner: '',
  examinee: '',
  button: '',
  meteo: '',
  vent: '',
  exercises: [] as string[]  // ✅ tableau pour multi select
  };

uniqueMeteo: string[] = [];
uniqueVent: string[] = [];
uniqueExercises: string[] = [];


  uniqueExaminers: string[] = [];
  uniqueExaminees: string[] = [];

  // Upload CSV
  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    Array.from(input.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) this.parseCSV(reader.result as string);
      };
      reader.readAsText(file);
    });
  }

  parseCSV(csv: string) {
    const lines = csv.split('\n').map(l => l.trim()).filter(l => l);
    const headers = lines.shift()?.split(',') || [];

    lines.forEach(line => {
      const values = line.split(',');
      const entry: any = {};
      headers.forEach((h, i) => entry[h] = values[i]);
      entry.tour = Number(entry.tour);
      entry.step = Number(entry.step);
      this.allEntries.push(entry as CsvEntry);
    });

    this.filteredEntries = [...this.allEntries];
    this.updateUniqueLists();
  }

  applyFilters() {
    this.filteredEntries = this.allEntries.filter(e =>
      (!this.filters.examiner || e.examinerName === this.filters.examiner) &&
      (!this.filters.examinee || e.examineeName === this.filters.examinee) &&
      (!this.filters.button || e.buttonClicked === this.filters.button) &&
      (!this.filters.meteo || e.meteo === this.filters.meteo) &&
      (!this.filters.vent || e.vent === this.filters.vent) &&
      (this.filters.exercises.length === 0 || this.filters.exercises.includes(e.value))
    );
  }


  updateUniqueLists() {
    this.uniqueExaminers = Array.from(new Set(this.allEntries.map(e => e.examinerName)));
    this.uniqueExaminees = Array.from(new Set(this.allEntries.map(e => e.examineeName)));
    this.uniqueMeteo = Array.from(new Set(this.allEntries.map(e => e.meteo)));
    this.uniqueVent = Array.from(new Set(this.allEntries.map(e => e.vent)));
    this.uniqueExercises = Array.from(new Set(this.allEntries.map(e => e.value))).sort((a, b) => a.localeCompare(b));
  }

  resetFilters() {
    this.filters = {
      examiner: '',
      examinee: '',
      button: '',
      meteo: '',
      vent: '',
      exercises: []
    };
    this.applyFilters();
  }



  get buttonRates(): { [key: string]: number } {
    const rates: { [key: string]: number } = {};
    const entries = this.filteredEntries;

    if (entries.length === 0) {
      // tous les taux à 0 si pas de lignes
      ['Haut','Bas','Gauche','Droite','Parfait'].forEach(b => rates[b] = 0);
      return rates;
    }

    const total = entries.length;
    ['Haut','Bas','Gauche','Droite','Parfait'].forEach(b => {
      const count = entries.filter(e => e.buttonClicked === b).length;
      rates[b] = Math.round((count / total) * 100);
    });

    return rates;
  }

  getButtonColor(button: string): string {
    const value = this.buttonRates[button] || 0;

    if (['Haut','Bas','Gauche','Droite'].includes(button)) {
      if (value < 5) return '#4caf50';       // vert
      if (value <= 10) return '#ff9800';      // orange
      return '#f44336';                        // rouge
    }

    if (button === 'Parfait') {
      if (value < 70) return '#f44336';       // rouge
      if (value <= 80) return '#ff9800';      // orange
      return '#4caf50';                        // vert
    }

    return '#ccc'; // fallback
  }
}
