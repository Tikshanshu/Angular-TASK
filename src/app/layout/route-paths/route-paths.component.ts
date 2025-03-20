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

  public chargeData = Jdata;

  beltIdentifiers: string[] = [];
  transformedData: { current: string; stats: any[] }[] = [];
  labelMap: { [key: string]: number } = {};
  beltLabelNames: { [key: number]: string } = {}; // Maps Y-axis values to BeltIdentifiers dynamically

  ngOnInit() {
    this.processData();
    this.transformData();
    console.log(this.transformedData);
    
  }

  public markerVisual = markerVisual;

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
        .map((item) => ({
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

        })),
    }));
  }

  public labelTemplate = (args: any) => {
    return this.beltLabelNames[args.value] || '';
  };

  public toggler: boolean = true;
  public mySelection: number[] = [];
  selectedRowIndex: number | null = null;
  public highlightedPoints = new Set<string>();

  public cellClickHandler(event: CellClickEvent): void {
    const y = event.dataItem.patternsequencegraphinfo?.BeltIdentifier;
    const x = event.dataItem.DistanceFromStart;
    const dnp = event.dataItem.DistanceToNextSeqPoint;
    const dpp = event.dataItem.DistanceFromPrevSeqPoint;

    this.onSeriesClick({
      dataItem: {
        beltId: y,
        time: x,
        distanceFromPrev: dpp,
        distanceToNext: dnp,
      },
    } as SeriesClickEvent);
  }

  public onSeriesClick(event: SeriesClickEvent) {
    const y = event.dataItem.beltId;
    const x = event.dataItem.time;

    const prevX = event.dataItem.distancefromprevseqpoint;
    const nextX = event.dataItem.distancetonextseqpoint;
    const yValue = event.dataItem.charge;

    // drawLines(x, prevX, nextX, yValue);

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
      this.items = this.getContextMenuItems(y);

      this.ChartContextMenu.show({
        left: event.originalEvent.pageX,
        top: event.originalEvent.pageY,
      });
    }
  }

  public onSeriesHover(e: SeriesHoverEvent) {
    e.preventDefault();
    this.chart.showTooltip(
      (p) =>
        p.value.x === e.dataItem.time &&
        p.value.y === this.labelMap[e.dataItem.beltId]
    );
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

  getSeriesColor(seriesType: string): string {
    switch (seriesType) {
      case 'StoppingPoint':
        return 'green';
      case 'TransferText':
        return 'red';
      default:
        return 'black';
    }
  }

  getSeriesWidth(seriesType: string): number {
    switch (seriesType) {
      case 'StoppingPoint':
        return 2.5;
      case 'TransferText':
        return 4;
      default:
        return 1;
    }
  }

  private zoomStep: number = 10;

  OnZoom(event: ZoomEvent) {}

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
  resetZoom() {
    const min = -this.valueAxis;
    const max = this.valueAxis;
    this.categoryAxis = Object.assign({}, this.categoryAxis, {
      min,
      max,
    });
  }

  @ViewChild('gridmenu')
  public ChartContextMenu: ContextMenuComponent;
  private contextItem: any;
  public items: any[] = [];

  getContextMenuItems(pointType: string): any[] {
    switch (pointType) {
      case 'StoppingPoint':
        return [
          { text: 'Call up', action: () => this.handleMenuAction('call up') },
        ];
      case 'AudioAnnouncement':
        return [{ text: 'Play', action: () => this.handleMenuAction('Play') }];
      default:
        return [
          { text: 'Option1', action: () => this.handleMenuAction('Option1') },
          { text: 'Option2', action: () => this.handleMenuAction('option2') },
        ];
    }
  }

  handleMenuAction(action: string) {
    console.log(`Action: ${action}, Data:`, this.contextItem);
    alert(`${action} selected for ${this.contextItem.beltId}`);
  }
}
