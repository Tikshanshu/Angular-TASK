 
 import { drawing } from "@progress/kendo-drawing";

 import {
   Element,
   geometry,
   Text,
   Group,
   Layout,
   Path,
 } from '@progress/kendo-drawing';
 const { Rect } = geometry;


 function generateRandomcolor():string{
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`
}
 
 export function markerVisual(args: any): Element{
    const rect = new Rect(args.rect.origin, args.rect.size);

    const layout = new Layout(rect, {
      orientation: 'vertical',
      alignItems: 'center',
      
      justifyContent: 'center',

    });

    const iconUnicode = '\uf028';

    const icon = new Text(iconUnicode, rect.center(), {
      font: `900 16px 'Font Awesome 6 Free' `, 
      fill: {
        color: '#32cc00', // Customize color
      },
      cursor:'pointer',

    });

    layout.append(icon);
    layout.reflow();
    console.log(args)

    return layout;
  };