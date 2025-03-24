import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IconsModule } from '@progress/kendo-angular-icons';
import Sdata from '../camera/response_1741707098235.json';
import {
  CellClickEvent,
  GridComponent,
  GridModule,
  RowArgs,
} from '@progress/kendo-angular-grid';
import { PopupModule } from '@progress/kendo-angular-popup';
import { markerVisual } from '../camera/drawing-scene';
import {
  ChartComponent,
  ChartsModule,
  PlotAreaClickEvent,
  RenderEvent,
  SelectEndEvent,
  SeriesClickEvent,
  SeriesHoverEvent,
  SeriesTooltipTemplateDirective,
  ZoomEvent,
} from '@progress/kendo-angular-charts';
import Jdata from './response_1742336623830.json';
import {
  ContextMenuComponent,
  KENDO_CONTEXTMENU,
} from '@progress/kendo-angular-menu';
import { ContextMenuModule } from '@progress/kendo-angular-menu';

import {
  getSeriesColor,
  getSeriesWidth,
  handleMenuAction,
  getContextMenuItems,
  resetZoom,

} from './helper';
import { geometry, Group, Path } from '@progress/kendo-drawing';

@Component({
  selector: 'app-route-paths',
  standalone: true,
  imports: [
    ChartsModule,
    CommonModule,
    IconsModule,
    GridModule,
    PopupModule,
    ContextMenuModule,
  ],
  templateUrl: './route-paths.component.html',
  styleUrl: './route-paths.component.scss',
})
export class RoutePathsComponent implements OnInit {
  @ViewChild('chart', { static: false }) chart: ChartComponent;
  @ViewChild('grid', { static: false }) grid: GridComponent;
  @ViewChild('gridmenu') public ChartContextMenu: ContextMenuComponent;
  public chargeData = Jdata;
  beltIdentifiers: string[] = [];
  transformedData: { current: string; stats: any[] }[] = [];
  labelMap: { [key: string]: number } = {};
  beltLabelNames: { [key: number]: string } = {};
  getseriesColor = getSeriesColor;
  getseriesWidth = getSeriesWidth;
  handleMenuAction = handleMenuAction;
  getContextMenuItems = getContextMenuItems;
  resetZoom = resetZoom;
 
  public markerVisual = markerVisual;
  public minX = 0;
  public maxX = 0;
  public majorGridLines = {
    color: 'lightgray',
    visible: true,
  };
  public majorTicks = {
    color: 'black',
    size: 15,
  };
  public zoomrate = 0.1;
  public toggler: boolean = true;
  public mySelection: number[] = [];
  selectedRowIndex: number | null = null;
  public highlightedPoints = new Set<string>();
  private zoomStep: number = 10;
  private contextItem: any;
  public items: any[] = [];

  public valueAxis = {
    name: 'value',
    labels: {
      format: '#.00',
    },
  };

  public categoryAxis = {
    name: 'category',
    maxDivisions: 10,
  };

  ngOnInit() {
    this.processData();
    this.transformData();
    
    
  }

  processData() {
    this.beltIdentifiers = [
      ...new Set(
        this.chargeData
          .map(
            (item) => item.patternsequencegraphinfo?.BeltIdentifier || 'Unknown'
          )
          .filter((identifier) => identifier !== 'Unknown')
      ),
    ];

    this.labelMap = {};
    this.beltLabelNames = {};

    let value = 20;
    this.beltIdentifiers.forEach((identifier) => {
      this.labelMap[identifier] = value;
      this.beltLabelNames[value] = identifier;
      value += 20;
    });
  }

  transformData() {
    this.transformedData = this.beltIdentifiers.map((identifier) => ({
      current: identifier,
      stats: this.chargeData
        .filter(
          (item) => item.patternsequencegraphinfo?.BeltIdentifier === identifier
        )
        .map((item) => {
          // Check if the point is a start or end of the announcement
          const isStartAnnouncement = item.guimapline?.Attributes !== undefined;
          const isEndAnnouncement = item.guimappoint?.Attributes !== undefined;

          this.minX = Math.min(this.minX, item.distancefromstart);
          this.maxX = Math.max(this.maxX, item.distancefromstart);

          return {
            time: item.distancefromstart,
            beltIdent: item.patternsequencegraphinfo.BeltIdentifier,
            charge: this.labelMap[identifier] || 0,
            beltId: identifier,
            distanceFromPrev: item.distancefromprevseqpoint,
            distanceToNext: item.distancetonextseqpoint,
            stopName: item.guirepresentationtext,
            pointType: item.pointtype,
            tripIndex: item.tripindex,
            routeIndex: item.routeindex,
            patternIndex: item.patternindex,
            // Extract Announcement Length and Duration based on whether it's a start or end
            announcementLength: isStartAnnouncement
              ? item.guimapline?.Attributes?.find(
                  (attr) => attr.Name === 'Announcement Length'
                )?.Value
              : isEndAnnouncement
              ? item.guimappoint?.Attributes?.find(
                  (attr) => attr.Name === 'Announcement Length'
                )?.Value
              : null,
            announcementDuration: isStartAnnouncement
              ? item.guimapline?.Attributes?.find(
                  (attr) => attr.Name === 'Announcement Duration'
                )?.Value
              : isEndAnnouncement
              ? item.guimappoint?.Attributes?.find(
                  (attr) => attr.Name === 'Announcement Duration'
                )?.Value
              : null,
            isStartAnnouncement: isStartAnnouncement,
          };
        }),
    }));
  }

  public labelTemplate = (args: any) => {
    return this.beltLabelNames[args.value] || '';
  };

  public cellClickHandler(event: CellClickEvent): void {
    const y = event.dataItem.patternsequencegraphinfo?.BeltIdentifier;
    const x = event.dataItem.DistanceFromStart;
    const dnp = event.dataItem.DistanceToNextSeqPoint;
    const dpp = event.dataItem.DistanceFromPrevSeqPoint;

    this.onSeriesClick({
      dataItem: {
        beltId: y,
        time: x,
        distancefromprevseqpoint: dpp,
        distancetonextseqpoint: dnp,
        charge: y,
      },
    } as SeriesClickEvent);
  }

  public onSeriesClick(event: SeriesClickEvent) {
    const y = event.dataItem.beltId;
    const x = event.dataItem.time;

    const prevX = event.dataItem.distancefromprevseqpoint;
    const nextX = event.dataItem.distancetonextseqpoint;
    const yValue = event.dataItem.charge;

    const selectedIndex = this.chargeData.findIndex(
      (item) =>
        item.distancefromstart === x &&
        item.patternsequencegraphinfo.BeltIdentifier === y
    );

    if (selectedIndex !== -1) {
      this.mySelection = [selectedIndex];
    }
    setTimeout(() => {
     this.scrollToRow(selectedIndex);
    }, 100);

    this.toggleChartHighlight(event);

    const key = `${event.dataItem.time}-${event.dataItem.beltId}`;

    if (this.highlightedPoints.has(key)) {
      this.highlightedPoints.delete(key);
      this.chart.toggleHighlight(
        false,
        (p) =>
          p.value.x === event.dataItem.time &&
          p.value.y === this.labelMap[event.dataItem.beltId]
      );
      this.chart.hideTooltip();
    } else {
      this.highlightedPoints.add(key);
      this.chart.toggleHighlight(
        true,
        (p) =>
          p.value.x === event.dataItem.time &&
          p.value.y === this.labelMap[event.dataItem.beltId]
      );
      this.chart.showTooltip(
        (point) =>
          point.value.x === event.dataItem.time &&
          point.value.y === this.labelMap[event.dataItem.beltId]
      );
    }
    console.log(event);

    if (event.originalEvent.type === 'contextmenu') {
      event.originalEvent.preventDefault();

      this.contextItem = event.dataItem;
      this.items = getContextMenuItems(y);

      this.ChartContextMenu.show({
        left: event.originalEvent.pageX,
        top: event.originalEvent.pageY,
      });
    }

  this.crosshairValue = {
    x: x,
    y: yValue 
  };
  this.renderCrosshair(event.sender);
  }

  public onSeriesHover(e: SeriesHoverEvent) {
    e.preventDefault();
    this.chart.showTooltip(
      (p) =>
        p.value.x === e.dataItem.time &&
        p.value.y === this.labelMap[e.dataItem.beltId]
    );
  }

  public scrollToRow(index: number): void {
    if (this.grid && this.grid.wrapper) {
      const gridElement = this.grid.wrapper.nativeElement;
      const rowHeight = 36;
      const scrollPosition = index * rowHeight;

      gridElement.querySelector('.k-grid-content').scrollTo({
        top: scrollPosition,
        behavior: 'smooth',
      });
    }
  }

  public isRowSelected = (e: RowArgs): boolean =>
    this.mySelection.includes(this.chargeData.indexOf(e.dataItem));

  public toggleChartHighlight(event: SeriesClickEvent): void {
    if (this.chart) {
      this.chart.showTooltip(
        (point) =>
          point.value.x === event.dataItem.time &&
          point.value.y === event.dataItem.charge
      );
    }
  }

  private crosshairValue = null;
  private crosshairVisual: Group = new Group();
  
  private renderCrosshair(chart: ChartComponent) {
    this.crosshairVisual.clear();
    if (!this.crosshairValue) return;
  
    const { x, y } = this.crosshairValue;
  
    // Get axes
    const xAxis = chart.findAxisByName('xAxis');
    const yAxis = chart.findAxisByName('yAxis');
    if (!xAxis || !yAxis) return;
  
    // --- Vertical Crosshair (unchanged) ---
    const xSlot = xAxis.slot(x) as geometry.Rect;
    const yRange = yAxis.range();
    const yFullSlot = yAxis.slot(yRange.min, yRange.max) as any;
    const yBbox = yFullSlot.bbox();
  
    const verticalLine = new Path({
      stroke: { color: 'red', width: 2 },
    }).moveTo(xSlot.center().x, yBbox.origin.y)
      .lineTo(xSlot.center().x, yBbox.bottomRight().y);
  
    this.crosshairVisual.append(verticalLine);
  
    // --- Find and Connect Adjacent Points ---
    const currentSeries = this.transformedData.find(
      series => series.stats.some(point => 
        point.time === x && point.charge === y
      )
    );
  
    if (currentSeries) {

      
      const points = currentSeries.stats;
      const currentIndex = points.findIndex(p => p.time === x && p.charge === y);

      console.log(points, currentIndex);
      
  
      // Connect to previous point
      if (currentIndex > 0) {
        const prevPoint = points[currentIndex - 1];
        this.drawConnectionLine(
          xAxis, yAxis, 
          prevPoint.time, prevPoint.charge, 
          x, y,
          'red', 2.5
        );
      }
  
      // Connect to next point
      if (currentIndex < points.length - 1) {
        const nextPoint = points[currentIndex + 1];
        this.drawConnectionLine(
          xAxis, yAxis,
          x, y,
          nextPoint.time, nextPoint.charge,
          'red', 2.5
        );
      }

      if(currentIndex){
        const currentPoint = points[currentIndex];
        this.drawConnectionLine(
          xAxis, yAxis,
          x, y-5,
          0, currentPoint.charge-5,
          'red', 2.5

        );
     
      }
    }
  
    chart.findPaneByIndex(0).visual.insert(0, this.crosshairVisual);
  }
  
  // Helper method to draw connection lines
  private drawConnectionLine(
    xAxis: any, 
    yAxis: any,
    x1: number, y1: number,
    x2: number, y2: number,
    color: string, 
    width: number
  ) {
    const startX = xAxis.slot(x1).center().x;
    const startY = yAxis.slot(y1-2).center().y;
    const endX = xAxis.slot(x2).center().x;
    const endY = yAxis.slot(y2-2).center().y;
  
    const line = new Path({
      stroke: { color, width },
    }).moveTo(startX, startY)
      .lineTo(endX, endY);
  
    this.crosshairVisual.append(line);
  }
  public onRender(args: RenderEvent): void {
    this.renderCrosshair(args.sender);
  }

 
}
