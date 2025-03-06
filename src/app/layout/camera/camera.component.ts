import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ChartsModule, SeriesClickEvent } from "@progress/kendo-angular-charts";
import { IconsModule } from "@progress/kendo-angular-icons";
import { markerVisual } from "./drawing-scene";
import chargeData from "./model-camera.json";
import { GridDataResult, KENDO_GRID } from "@progress/kendo-angular-grid";
import { GridModule } from '@progress/kendo-angular-grid'; 

@Component({
  selector: "app-camera",
  standalone: true,
  imports: [ChartsModule, CommonModule, IconsModule,GridModule],
  templateUrl: "./camera.component.html",
  styleUrls: ["./camera.component.scss"],
})
export class CameraComponent {

  
  
  public chargeData = chargeData;
  public gridView: GridDataResult = {
    data: chargeData,
    total: chargeData.length,
  };
  

  public y_filed:number[]=[20,40,80];
  public y_label:string[]=["Stopping Point","Audio","Tariff Zone"];
  public c:number=0;

  public labelTemplate = (args: any) => {

    if(args.value=== 20)
    {
      args.text="Stopping Point"
    }
    else if(args.value=== 40)
    {
      args.text="Audio"
    }
    else if(args.value===80)
    {
      args.text="Tariff Zone"
    }
    else{
      args.text="";
    }
    console.log(args);

    return args.text;
  };

 

  public markerVisual=markerVisual;

  public onSeriesClick(event: SeriesClickEvent): void {

    if (event.value.y===40 && event.value.x===10) {
      alert(
        `Clicked `
      );
    }
  }
  
  
}
