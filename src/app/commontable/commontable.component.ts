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
 public editedField: any;

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
      case 'shortcode':
      case "langbezeichner":
      case 'Externalid':
      case 'zonewabeindex':
        case 'assetpictureindex':
          case 'effectonccdelta':  
      case 'tlpmode':
      case 'fahrzeugansagetextindex':
      case 'parenttableindex':
      case 'haltestellensymbolindex':
      case 'vorschauzeit':
        return 'text';
      
      case 'stopnumber':
      case 'haltestellenlangnummer':
      case "importstatus":
      case 'nationalstopnumber':
      case 'longitude':
      case 'latitude':
        return 'numeric';
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
        const formGroup = this.createFormGroup(this.cellArgs.dataItem);
        const control = formGroup.get(this.editedField); 

        if (control) {
            control.enable(); 
        }

        this.cellArgs.sender.editCell(this.cellArgs.rowIndex, this.cellArgs.columnIndex, formGroup);
    }
}



public cellClickHandler(args: CellClickEvent): void {
  this.cellArgs = args;
  this.editedField = args.column.field;
}


  public cellCloseHandler(args: CellCloseEvent): void {
    const { formGroup, dataItem } = args;
    
    if (formGroup.dirty && this.editedField) { // Ensure a field was edited
        if (args.originalEvent && args.originalEvent.keyCode === Keys.Escape) {
            return; // Ignore changes if Esc was pressed
        }

        const control = formGroup.get(this.editedField); // Get only the edited field

        if (control && control.invalid) {
            // If invalid, revert to the original value
            formGroup.patchValue({ [this.editedField]: dataItem[this.editedField] }, { emitEvent: false });
        } else {
            // If valid, update the data item with the new value
            dataItem[this.editedField] = control?.value;
            this.editService.update(dataItem);
        }
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
    const formGroup = this.formBuilder.group({
      primarykeyduid: [
        dataItem.primarykeyduid, 
        [Validators.pattern('^[a-zA-Z0-9 ]*$')]
      ],
      stopnumber: [
        dataItem.stopnumber,
        [Validators.pattern('^[0-9]+$')]
      ],
      shortcode: [
        dataItem.shortcode, 
        [Validators.pattern('^[a-zA-Z0-9 ]*$')]
      ],
      langbezeichner: [
        dataItem.langbezeichner, 
        [Validators.pattern('^[a-zA-Z0-9 ]*$'), Validators.minLength(3)]
      ],
      externalid: [
        dataItem.externalid, 
        [Validators.pattern('^[a-zA-Z0-9-_ ]*$')]
      ],
      haltestellenlangnummer: [
        dataItem.haltestellenlangnummer, 
        [Validators.pattern('^[0-9]+$')]
      ],
      zonewabeindex: [
        dataItem.zonewabeindex, 
        [Validators.pattern('^[a-zA-Z0-9 ]*$')]
      ],
      ibisbezeichner: [
        dataItem.ibisbezeichner, 
        [Validators.pattern('^[a-zA-Z0-9 ]*$'), Validators.minLength(2)]
      ],
      tlpmode: [
        dataItem.tlpmode, 
        [Validators.pattern('^[a-zA-Z0-9 ]*$'), Validators.minLength(2)]
      ],
      fahrzeugansagetextindex: [
        dataItem.fahrzeugansagetextindex, 
        [Validators.pattern('^[a-zA-Z0-9 ]*$'), Validators.minLength(2)]
      ],
      parenttableindex: [
        dataItem.parenttableindex, 
        [Validators.pattern('^[0-9]+$')]
      ],
      tarifortsname: [
        dataItem.tarifortsname, 
        [Validators.pattern('^[a-zA-Z0-9 ]*$')]
      ],
      haltestellensymbolindex: [
        dataItem.haltestellensymbolindex, 
        [Validators.pattern('^[0-9]+$')]
      ],
      mfaanschlussbildschirm: [
        dataItem.mfaanschlussbildschirm, 
        [Validators.pattern('^[0-9]+$')]
      ],
      vorschauzeit: [
        dataItem.vorschauzeit, 
        [Validators.pattern('^[0-9]+$')]
      ],
      importstatus: [
        dataItem.importstatus, 
        [Validators.required, Validators.pattern('^[0-9]+$')]
      ],
      commentary: [
        dataItem.commentary, 
        [Validators.pattern('^[a-zA-Z0-9 ]*$'), Validators.maxLength(255)]
      ],
      nationalstopnumber: [
        dataItem.nationalstopnumber, 
        [Validators.pattern('^[0-9]+$')]
      ],
      stopiconforcc: [
        dataItem.stopiconforcc, 
        [Validators.pattern('^[a-zA-Z0-9-_ ]*$')]
      ],
      assetpictureindex: [
        dataItem.assetpictureindex, 
        [Validators.pattern('^[0-9]+$')]
      ],
      effectonccdelta: [
        dataItem.effectonccdelta, 
        [Validators.pattern('^[0-9]+$')]
      ],
      isdepot: [
        dataItem.isdepot, 
        [Validators.pattern('^(true|false|yes|no)$')]
      ],
      longitude: [
        dataItem.longitude, 
        [Validators.pattern('^-?\\d{1,3}\\.\\d+$')]
      ],
      latitude: [
        dataItem.latitude, 
        [ Validators.pattern('^-?\\d{1,2}\\.\\d+$')]
      ],

    });

     // Disable validation by default, enable only when editing
     Object.keys(formGroup.controls).forEach(field => {
      formGroup.get(field)?.disable(); // Disable validation initially
  });
    return formGroup;
  }

  
  
}
