import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ChartsModule } from "@progress/kendo-angular-charts";
import { IconsModule } from "@progress/kendo-angular-icons";

@Component({
  selector: "app-camera",
  imports: [ChartsModule, CommonModule, IconsModule],
  templateUrl: "./camera.component.html",
  styleUrls: ["./camera.component.scss"],
})
export class CameraComponent {
  public chargeData = [
    {
      current: 0.8,
      stats: [
        { time: 10, charge: 10 },
        { time: 15, charge: 10 },
        { time: 20, charge: 10 },
        { time: 32, charge: 10 },
        { time: 43, charge: 10 },
        { time: 55, charge: 10 },
        { time: 60, charge: 10 },
        { time: 70, charge: 10 },
        { time: 90, charge: 10 },
      ],
    },
    {
      current: 1.6,
      stats: [
        { time: 10, charge: 20 },
        { time: 17, charge: 20 },
        { time: 18, charge: 20 },
        { time: 35, charge: 20 },
        { time: 47, charge: 20 },
        { time: 60, charge: 20 },
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
  ];
  public labelTemplate = (value: number) => {
    const labelMap = {
      20: "A",
      40: "B",
      60: "C",
      80: "D",
      100: "E",
    };
    return labelMap[value] || "";
  };
}
