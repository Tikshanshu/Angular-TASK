import { Path, Group, drawing } from "@progress/kendo-drawing";

let surface: drawing.Surface | null = null; // Maintain a reference to the surface

export function drawLines(prevX: number, currentX: number, nextX: number, yValue: number) {
    const chartContainer = document.getElementById("chartContainer");

    if (!chartContainer) {
        console.error("Chart container not found!");
        return;
    }

    // Create or reuse an existing surface
    if (!surface) {
        surface = drawing.Surface.create(chartContainer);
    } else {
        surface.clear(); // Clear previous lines but keep the chart
    }

    const group = new Group();

    // Red line from previous point to current
    const prevLine = new Path({
        stroke: { color: "red", width: 2 }
    }).moveTo(prevX, yValue).lineTo(currentX, yValue);

    // Blue line from current to next
    const nextLine = new Path({
        stroke: { color: "blue", width: 2 }
    }).moveTo(currentX, yValue).lineTo(nextX, yValue);

    // Dashed vertical line through the current point
    const verticalLine = new Path({
        stroke: { color: "black", width: 1, dashType: "dash" }
    }).moveTo(currentX, 0).lineTo(currentX, 120); 

    group.append(prevLine, nextLine, verticalLine);
    surface.draw(group);
}
