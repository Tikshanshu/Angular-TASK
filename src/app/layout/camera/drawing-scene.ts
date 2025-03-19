
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
 

  // Adjusting position of the icon (10 units left)
  const iconPosition = new Point(args.rect.origin.x - 10, args.rect.origin.y);
  const rect = new Rect(iconPosition, args.rect.size);

  // Create layout for positioning
  const layout = new Layout(rect, {
    orientation: "vertical",
    alignItems: "center",
    justifyContent: "center",
  });

  // Announcement Icon (FontAwesome Unicode)
  const iconUnicode = "\uf028";

  const icon = new Text(iconUnicode, rect.center(), {
    font: `900 16px 'Font Awesome 6 Free'`,
    fill: {
      color: "#5b5beb", // Customize color
    },
    cursor: "pointer",
  });

  layout.append(icon);
  layout.reflow();

  // Create a caret (^) shape path from icon to actual point
  const path = new Path({
    stroke: {
      color: "#000", // Black color for the caret shape
      width: .5,
    },
  });

  const iconX = iconPosition.x;
  const iconY = iconPosition.y;
  const actualX = args.rect.origin.x;
  const actualY = args.rect.origin.y;

  // Constructing a caret (^) shape
  path.moveTo(iconX, iconY) // Start from icon position
    .lineTo((iconX + actualX) / 2, iconY - 30) // Peak of ^
    .lineTo(actualX, actualY); // Connect to actual point

  // Create a group to hold both icon and caret shape
  const group = new Group();
  group.append(layout);
  group.append(path);

  return group;
}
