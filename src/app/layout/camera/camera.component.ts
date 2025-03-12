import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ChartsModule,
  PlotAreaClickEvent,
  SelectEndEvent,
  SeriesClickEvent,
  SeriesHoverEvent,
  SeriesTooltipTemplateDirective,
  ZoomEvent,
} from '@progress/kendo-angular-charts';
import { IconsModule } from '@progress/kendo-angular-icons';
import { markerVisual } from './drawing-scene';
import chargeData from './model-camera.json';
import {
  CellClickEvent,
  GridComponent,
  GridDataResult,
  KENDO_GRID,
  RowArgs,
  SelectionEvent,
} from '@progress/kendo-angular-grid';
import { GridModule } from '@progress/kendo-angular-grid';
import { PopupModule } from '@progress/kendo-angular-popup';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [ChartsModule, CommonModule, IconsModule, GridModule, PopupModule],
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class CameraComponent {
  @ViewChild('chart', { static: false }) chart: ChartComponent;
  @ViewChild('p_container', { static: false }) pContainer: ElementRef;
  @ViewChild('grid', { static: false }) grid: GridComponent;

  public chargeData = chargeData;

  public flattenedChargeData = this.chargeData.flatMap((item) => item.stats);

  public y_filed: number[] = [20, 40, 80];
  public y_label: string[] = ['Stopping Point', 'Audio', 'Tariff Zone'];
  public c: number = 0;
  public mySelection: number[] = [];

  public labelTemplate = (args: any) => {
    if (args.value === 20) {
      args.text = 'Stopping Point';
    } else if (args.value === 40) {
      args.text = 'Audio';
    } else if (args.value === 80) {
      args.text = 'Tariff Zone';
    } else {
      args.text = '';
    }

    return args.text;
  };
  


  public popupVisible: boolean = false;
  public activePoint: any = null;
  public toggler: boolean = true;
  public popupOffset = { top: 0, left: 0 };
  selectedRowIndex: number | null = null;
  x_cord: number;
  y_cord: number;

  public markerVisual = markerVisual;

  popoverVisible = false;
  popoverData: { time?: number; charge?: number } = {};
  popupPosition: { x: number; y: number; };


  public onSeriesHover(event:SeriesHoverEvent,ch:ChartComponent){
    setTimeout(() => {
      ch.hideTooltip();
    });
  }

  public onSeriesClick(event: SeriesClickEvent): void {
    const x = event.dataItem.time;
    const y = event.dataItem.charge;

    if (y == 40) {
      alert('announcement');
    }

    const selectedIndex = this.flattenedChargeData.findIndex(
      (item) => item.time === x && item.charge === y
    );

    if (selectedIndex !== -1) {
      this.mySelection = [selectedIndex];
    }
    setTimeout(() => {
      this.scrollToRow(selectedIndex);
    }, 100);

    setTimeout(() => {
      this.chart.hideTooltip();
    });

    this.toggleChartHighlight(event);

    if (
      this.activePoint &&
      this.activePoint.time === x &&
      this.activePoint.charge === y
    ) {
      this.popupVisible = !this.popupVisible;
      if (!this.popupVisible) {
        this.activePoint = null;
      }
      return;
    }
    

    this.popupVisible = true;
    this.activePoint = {
      time: x,
      charge: y,
      point: event.point,
      series: event.series,
    };

    if (event.originalEvent) {
      const rect = (
        event.originalEvent.target as HTMLElement
      ).getBoundingClientRect();


      
      this.popupOffset = {
        top: (rect.top+event.originalEvent.event.offsetY+10 ),
        left:(rect.left+event.originalEvent.event.offsetX-30)
      };

      
    }
  }
  

  public isRowSelected = (e: RowArgs): boolean => this.mySelection.includes(this.flattenedChargeData.indexOf(e.dataItem));

  public toggleChartHighlight(event: SeriesClickEvent): void {
    if (this.chart) {
      this.chart.showTooltip(
        (point) =>
          point.value.x === event.dataItem.time &&
          point.value.y === event.dataItem.charge
      );
    }
  }

  public cellClickHandler(args: CellClickEvent) {
    this.x_cord = args.dataItem.time;
    this.y_cord = args.dataItem.charge;

    if (this.toggler) {
      this.onSeriesClick({
        dataItem: { time: this.x_cord, charge: this.y_cord },
      } as SeriesClickEvent);
    }
  }

  public scrollToRow(index: number): void {
    if (this.grid && this.grid.wrapper) {
      const gridElement = this.grid.wrapper.nativeElement;
      const rowHeight = 36; // Adjust based on actual row height
      const scrollPosition = index * rowHeight;

      gridElement.querySelector('.k-grid-content').scrollTo({
        top: scrollPosition,
        behavior: 'smooth',
      });
    }
  }
  
}
