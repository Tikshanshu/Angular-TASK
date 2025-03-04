import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ChartsModule } from "@progress/kendo-angular-charts";
import { IconsModule } from "@progress/kendo-angular-icons";
import { drawing, geometry } from "@progress/kendo-drawing";

@Component({
  selector: "app-camera",
  standalone: true,
  imports: [ChartsModule, CommonModule, IconsModule],
  templateUrl: "./camera.component.html",
  styleUrls: ["./camera.component.scss"],
})
export class CameraComponent {
  public chargeData = [
    {
      current: 0.8,
      stats: [
        { time: 10, charge: 20 },
        { time: 15, charge: 20 },
        { time: 20, charge: 20 },
        { time: 32, charge: 20 },
        { time: 43, charge: 20 },
        { time: 55, charge: 20 },
        { time: 60, charge: 20 },
        { time: 70, charge: 20 },
        { time: 90, charge: 20 },
      ],
      segments: [
        { from: 10, to: 20, color: '#399d60' },
        { from: 20, to: 40, color: '#ff1234' },
        { from: 40, to: 60, color: '#3f0000' }
      ]
    },
    {
      current: 1.6,
      stats: [
        { time: 10, charge: 40 },
        { time: 17, charge: 40 },
        { time: 18, charge: 40 },
        { time: 35, charge: 40 },
        { time: 47, charge: 40 },
        { time: 60, charge: 40 },
      ],
    },
    {
      current: 3.2,
      stats: [
        { time: 10, charge: 80 },
        { time: 13, charge: 80 },
        { time: 25, charge: 80 },
      ],
    },
    {
      current: 3.2,
      stats: [
        { time: 30, charge: 80 },
        { time: 43, charge: 80 },
        { time: 55, charge: 80 },
      ],
    },
  ];

  private labelMap: { [key: number]: string } = {
    20: "A",
    0:  "Y",
    40: "B",
    60: "C",
    80: "D",
    100: "E",
  };

  public labelTemplate = (args: any) => {
    return this.labelMap[args.value] || args.value;
  };

  public getLabel(charge: number): string {
    return this.labelMap[charge] || charge.toString();
  }


  public markerVisual = (args: any) => {
    const rect = args.rect;

    const button = new drawing.Group();
    const buttonElement = new drawing.Rect(
      new geometry.Rect([rect.center().x - 10, rect.center().y - 10], [20, 20]),
      {
        stroke: { color: "black", width: 1 },
        fill: { color: "lightblue" }
      }
    );

  

    button.append(buttonElement);
  
    return button;
  };
  
  
}
