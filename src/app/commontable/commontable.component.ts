import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CellSelectionItem, DataStateChangeEvent, GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';  
import { GridModule } from '@progress/kendo-angular-grid';  
import { CompositeFilterDescriptor, filterBy, process, State, FilterDescriptor } from '@progress/kendo-data-query';
import { FormsModule } from '@angular/forms';

import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { DialogModule } from "@progress/kendo-angular-dialog";
import { EditService } from '../services/edit.service';
import { Observable } from "rxjs";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import {
  AddEvent,
  CellClickEvent,
  CellCloseEvent,
  SaveEvent,
  CancelEvent,
  GridComponent,
  RemoveEvent,
} from "@progress/kendo-angular-grid";
import { Keys } from "@progress/kendo-angular-common";
import { Stop } from "../Models/stop.model";
import { map } from "rxjs/operators";


@Component({
  selector: 'app-commontable',
  standalone: true,
  imports: [CommonModule, GridModule,FormsModule, ButtonsModule, DropDownsModule, DialogModule],
  templateUrl: './commontable.component.html',
  styleUrls: ['./commontable.component.scss'],
  providers: [EditService]
})
export class CommontableComponent implements OnInit, OnChanges {
  
  titles: string[] = [];
  @Input() dataArray: any[] = [];
  public pageSize = 129;
  public skip = 0;
  
  public state: State = {
    skip: this.skip,
    take: this.pageSize,
    sort: [],
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public gridView:  Observable<GridDataResult>;
 
 public changes = {};
 public cellArgs: CellClickEvent;

 constructor(
   private formBuilder: FormBuilder,
   public editService: EditService
 ) {}
 
  ngOnInit(): void {
    this.updateTitles();
    this.gridView = this.editService.pipe(
      map((data) => process(data, this.state))
    );
    this.editService.read();
  }

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

  
 public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.loadItems();
  }

  getEditable(t:string): boolean {
    return t !== 'primarykeyduid';
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
    this.gridView = this.editService.pipe(
      map((data) => process(data, this.state))
    );
  }
  
  public onDblClick(): void {
    if (!this.cellArgs.isEdited) {
      this.cellArgs.sender.editCell(
        this.cellArgs.rowIndex,
        this.cellArgs.columnIndex,
        this.createFormGroup(this.cellArgs.dataItem)
      );
    }
  }

  public cellClickHandler(args: CellClickEvent): void {
    this.cellArgs = args;
  }

  public cellCloseHandler(args: CellCloseEvent): void {
    const { formGroup, dataItem } = args;

    if (formGroup.dirty) {
      if (args.originalEvent && args.originalEvent.keyCode === Keys.Escape) {
        return;
      }

      this.editService.assignValues(dataItem, formGroup.value);
      this.editService.update(dataItem);
    }
    console.log(args);
  }

  public addHandler(args: AddEvent): void {
    args.sender.addRow(this.createFormGroup(new Stop()));
  }

  public cancelHandler(args: CancelEvent): void {
    args.sender.closeRow(args.rowIndex);
  }

  public saveHandler(args: SaveEvent): void {
    if (args.formGroup.valid) {
      this.editService.create(args.formGroup.value);
      args.sender.closeRow(args.rowIndex);
    }
  }

  public removeHandler(args: RemoveEvent): void {
    this.editService.remove(args.dataItem);
    args.sender.cancelCell();
  }

  public saveChanges(grid: GridComponent): void {
    grid.closeCell();
    grid.cancelCell();
    this.editService.saveChanges();
  }

  public cancelChanges(grid: GridComponent): void {
    grid.cancelCell();
    this.editService.cancelChanges();
  }

  public createFormGroup(dataItem: Stop): FormGroup {
    return this.formBuilder.group({
      primarykeyduid: dataItem.primarykeyduid,
      stopnumber: [dataItem.stopnumber, Validators.required],
      shortcode: [dataItem.shortcode, Validators.required],
      langbezeichner: [dataItem.langbezeichner, Validators.required],
      externalid: dataItem.externalid,
      haltestellenlangnummer: [dataItem.haltestellenlangnummer, Validators.required],
      zonewabeindex: [dataItem.zonewabeindex, Validators.required],
      ibisbezeichner: [dataItem.ibisbezeichner, Validators.required],
      tlpmode: [dataItem.tlpmode, Validators.required],
      fahrzeugansagetextindex: [dataItem.fahrzeugansagetextindex, Validators.required],
      parenttableindex: dataItem.parenttableindex,
      tarifortsname: dataItem.tarifortsname,
      haltestellensymbolindex: dataItem.haltestellensymbolindex,
      mfaanschlussbildschirm: dataItem.mfaanschlussbildschirm,
      vorschauzeit: dataItem.vorschauzeit,
      importstatus: [dataItem.importstatus, Validators.required],
      commentary: dataItem.commentary,
      nationalstopnumber: dataItem.nationalstopnumber,
      stopiconforcc: dataItem.stopiconforcc,
      assetpictureindex: dataItem.assetpictureindex,
      effectonccdelta: dataItem.effectonccdelta,
      isdepot: [dataItem.isdepot, Validators.required],
      longitude: [dataItem.longitude, Validators.required],
      latitude: [dataItem.latitude, Validators.required],
      haltestellenindex: [dataItem.haltestellenindex, Validators.required],
    });
  }
  
}
