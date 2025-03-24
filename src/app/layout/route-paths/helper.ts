

  
   export function getSeriesColor(seriesType: string): string {
      switch (seriesType) {
        case 'StoppingPoint':
          return 'green';
        case 'TransferText':
          return 'red';
        default:
          return 'black';
      }
    }
  
 export function getSeriesWidth(seriesType: string): number {
      switch (seriesType) {
        case 'StoppingPoint':
          return 2.5;
        case 'TransferText':
          return 4;
        default:
          return 1;
      }
    }

    export function resetZoom() {
        const min = -this.valueAxis;
        const max = this.valueAxis;
        this.categoryAxis = Object.assign({}, this.categoryAxis, {
          min,
          max,
        });
      }

    export function  getContextMenuItems(pointType: string): any[] {
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
    
   export function   handleMenuAction(action: string) {
        console.log(`Action: ${action}, Data:`, this.contextItem);
        alert(`${action} selected for ${this.contextItem.beltId}`);
      }