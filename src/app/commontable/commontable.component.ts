import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';  
import { GridModule } from '@progress/kendo-angular-grid';  
import { CompositeFilterDescriptor, filterBy, process, State, FilterDescriptor } from '@progress/kendo-data-query';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-commontable',
  standalone: true,
  imports: [CommonModule, GridModule,FormsModule],
  templateUrl: './commontable.component.html',
  styleUrls: ['./commontable.component.scss']
})
export class CommontableComponent implements OnInit, OnChanges {
  titles: string[] = [];
  public gridView: GridDataResult = { data: [], total: 0 };
  public pageSize = 29;
  public skip = 0;
  @Input() dataArray: any[] = [];
  
 
  public state: State = {
    skip: this.skip,
    take: this.pageSize,
    sort: [],
    filter: {
      logic: 'and',
      filters: []
    }
  };

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataArray']) {
      this.updateTitles();
      this.loadItems(); 
    }
  }

  private updateTitles(): void {
    if (this.dataArray && this.dataArray.length > 0) {
      this.titles = Object.keys(this.dataArray[0]);
    }
  }

  formatColumnTitle(title: string): string {
    return title.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  }

  
  filterChange(filter: CompositeFilterDescriptor): void {
    this.state.filter = {
      logic: 'and',
      filters: [...this.state.filter.filters, ...filter.filters]
    };
    this.loadItems();
}

  
  
  getColumnFilter(field: string): 'text' | 'numeric' | 'date' | 'boolean' {
    switch (field) {
      case 'primarykeyduid':
      case 'externalid':
      case 'ibisbezeichner':
      case 'stopiconforcc':
      case 'mfaanschlussbildschirm':
      case 'tarifortsname':
      case 'commentary':
        return 'text';
      
      case 'stopnumber':
      case 'haltestellenlangnummer':
      case 'zonewabeindex':
      case 'fahrzeugansagetextindex':
      case 'parenttableindex':
      case 'haltestellensymbolindex':
      case 'nationalstopnumber':
      case 'assetpictureindex':
      case 'effectonccdelta':
      case 'longitude':
      case 'latitude':
      case 'haltestellenindex':
        return 'numeric';
      case 'vorschauzeit':
        return 'date';
      case 'isdepot':
        return 'boolean';
      default:
        return 'text';
    }
  }
  
  public pageChange(event: PageChangeEvent): void {
    this.state.skip = event.skip;
    this.loadItems();
  }

  private loadItems(): void {
    const filteredData = process(this.dataArray, { filter: this.state.filter }).data;
  
    this.gridView = {
      data: filteredData.slice(this.state.skip, this.state.skip + this.pageSize),
      total: filteredData.length
    };
  }
  

  
}
