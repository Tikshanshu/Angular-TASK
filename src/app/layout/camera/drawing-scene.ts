import {
  Element,
  geometry,
  Text,
  Group,
  Layout,
  Path,
} from "@progress/kendo-drawing";

const { Rect, Point } = geometry;

export function markerVisual(args: any): Element {
  const point = args.dataItem;
  const isStartAnnouncement = point.isStartAnnouncement;
  const iconPosition = new Point(args.rect.origin.x, args.rect.origin.y);
  const rect = new Rect(iconPosition, args.rect.size);
  const layout = new Layout(rect, {
    orientation: "vertical",
    alignItems: "center",
    justifyContent: "center",
  });

  if (isStartAnnouncement) {
    const iconUnicode = "\uf028";
    const icon = new Text(iconUnicode, rect.center(), {
      font: `900 16px 'Font Awesome 6 Free'`,
      fill: {
        color: "#5b5beb",
      },
      cursor: "pointer",
    });

    layout.append(icon);
    layout.reflow();

    const path = new Path({
      stroke: {
        color: "#000",
        width: 0.5,
      },
    });

  // Get the chart axis
  const categoryAxis = args.sender.findAxisByName('xAxis');
    
  // Convert data values to screen coordinates
  const startX = iconPosition.x;
  const announcementLength = parseFloat(point.announcementLength);
  
  // Convert the announcement length to screen coordinates
  const endXData = point.time + announcementLength;
  const endXScreen = categoryAxis.slot(endXData).center().x;
  
  // Calculate midpoint in screen coordinates
  const peakX = startX + (endXScreen - startX) / 2;
  const endX = endXScreen;

  const iconY = iconPosition.y;
  
  // Draw the path
  path.moveTo(startX, iconY)
      .lineTo(peakX, iconY - 30)
      .lineTo(endX, iconY);

    const group = new Group();
    group.append(layout);
    group.append(path);

    return group;
  } else {
    return args.createVisual();
  }
}
