import { Injectable, Inject, Optional } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

export interface DateFormatConfig {
  format: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY/MM/DD' | 'DD-MM-YYYY' | 'MM-DD-YYYY' | 'YYYY-MM-DD';
}

export const DATE_FORMAT_CONFIG = 'DATE_FORMAT_CONFIG';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  private currentFormat: DateFormatConfig['format'] = 'DD/MM/YYYY';

  constructor(
    @Optional() @Inject(DATE_FORMAT_CONFIG) private config?: DateFormatConfig
  ) {
    super();
    if (config?.format) {
      this.currentFormat = config.format;
    }
  }

  // Method to update format dynamically
  setFormat(format: DateFormatConfig['format']): void {
    this.currentFormat = format;
  }

  override parse(value: string): Date | null {
    if (!value) return null;
    
    const trimmedValue = value.trim();
    const separator = this.getSeparator();
    const parts = trimmedValue.split(separator);
    
    if (parts.length === 3) {
      let day: number, month: number, year: number;
      
      switch (this.currentFormat) {
        case 'DD/MM/YYYY':
        case 'DD-MM-YYYY':
          day = +parts[0];
          month = +parts[1] - 1; // Month is 0-indexed
          year = +parts[2];
          break;
          
        case 'MM/DD/YYYY':
        case 'MM-DD-YYYY':
          month = +parts[0] - 1; // Month is 0-indexed
          day = +parts[1];
          year = +parts[2];
          break;
          
        case 'YYYY/MM/DD':
        case 'YYYY-MM-DD':
          year = +parts[0];
          month = +parts[1] - 1; // Month is 0-indexed
          day = +parts[2];
          break;
          
        default:
          return null;
      }
      
      // Validate the parsed values
      if (this.isValidDate(year, month, day)) {
        return new Date(year, month, day);
      }
    }
    
    return null;
  }

  override format(date: Date): string {
    if (!date || isNaN(date.getTime())) return '';
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const separator = this.getSeparator();
    
    switch (this.currentFormat) {
      case 'DD/MM/YYYY':
      case 'DD-MM-YYYY':
        return `${day}${separator}${month}${separator}${year}`;
        
      case 'MM/DD/YYYY':
      case 'MM-DD-YYYY':
        return `${month}${separator}${day}${separator}${year}`;
        
      case 'YYYY/MM/DD':
      case 'YYYY-MM-DD':
        return `${year}${separator}${month}${separator}${day}`;
        
      default:
        return `${day}${separator}${month}${separator}${year}`;
    }
  }

  private getSeparator(): string {
    return this.currentFormat.includes('/') ? '/' : '-';
  }

  private isValidDate(year: number, month: number, day: number): boolean {
    // Basic validation
    if (year < 1900 || year > 2999) return false;
    if (month < 0 || month > 11) return false;
    if (day < 1 || day > 31) return false;
    
    // Create date and check if it's the same as input (handles invalid dates like Feb 30)
    const testDate = new Date(year, month, day);
    return testDate.getFullYear() === year &&
           testDate.getMonth() === month &&
           testDate.getDate() === day;
  }
}

// Alternative approach: Create a factory function for different formats
export function createCustomDateAdapter(format: DateFormatConfig['format']) {
  return class extends CustomDateAdapter {
    constructor() {
      super({ format });
    }
  };
}