import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Stop } from "../Models/stop.model";
import { map } from "rxjs/operators";
import tik from '../../../public/assets/mock/stops.json';

const CREATE_ACTION = "create";
const UPDATE_ACTION = "update";
const REMOVE_ACTION = "destroy";

const itemIndex = (item: Stop, data: Stop[]): number => {
  for (let idx = 0; idx < data.length; idx++) {
    if (data[idx].primarykeyduid === item.primarykeyduid) {
      return idx;
    }
  }
  return -1;
};

const cloneData = (data: Stop[]) =>
  data.map((item) => Object.assign({}, item));

@Injectable()
export class EditService extends BehaviorSubject<Stop[]> {
  private data: Stop[] = [];
  private originalData: Stop[] = [];
  private createdItems: Stop[] = [];
  private updatedItems: Stop[] = [];
  private deletedItems: Stop[] = [];

  constructor() {
    super([]);
  }

  public read(): void {
    if (this.data.length) {
      return super.next(this.data);
    }

    // Use the local JSON data instead of making an HTTP request
    this.data = tik;
    this.originalData = cloneData(tik);
    super.next(this.data);
  }

  public create(item: Stop): void {
    this.createdItems.push(item);
    this.data.unshift(item);

    super.next(this.data);
  }

  public update(item: Stop): void {
    if (!this.isNew(item)) {
      const index = itemIndex(item, this.updatedItems);
      if (index !== -1) {
        this.updatedItems.splice(index, 1, item);
      } else {
        this.updatedItems.push(item);
      }
    } else {
      const index = this.createdItems.indexOf(item);
      this.createdItems.splice(index, 1, item);
    }
  }

  public remove(item: Stop): void {
    let index = itemIndex(item, this.data);
    this.data.splice(index, 1);

    index = itemIndex(item, this.createdItems);
    if (index >= 0) {
      this.createdItems.splice(index, 1);
    } else {
      this.deletedItems.push(item);
    }

    index = itemIndex(item, this.updatedItems);
    if (index >= 0) {
      this.updatedItems.splice(index, 1);
    }

    super.next(this.data);
  }

  public isNew(item: Stop): boolean {
    return !item.primarykeyduid;
  }

  public hasChanges(): boolean {
    return Boolean(
      this.deletedItems.length ||
        this.updatedItems.length ||
        this.createdItems.length
    );
  }
  

  public saveChanges(): void {
    if (!this.hasChanges()) {
      return;
    }

    // Simulate saving changes locally
    if (this.deletedItems.length) {
      this.data = this.data.filter(
        (item) => !this.deletedItems.includes(item)
      );
    }

    if (this.updatedItems.length) {
      this.updatedItems.forEach((updatedItem) => {
        const index = itemIndex(updatedItem, this.data);
        if (index !== -1) {
          this.data[index] = updatedItem;
        }
      });
    }

    if (this.createdItems.length) {
      this.data = [...this.createdItems, ...this.data];
    }

    this.reset();
    super.next(this.data);
  }

  public cancelChanges(): void {
    this.reset();

    this.data = this.originalData;
    this.originalData = cloneData(this.originalData);
    super.next(this.data);
  }

  public assignValues(target: Stop, source: Stop): void {
    Object.assign(target, source);
  }

  private reset() {
    this.data = [];
    this.deletedItems = [];
    this.updatedItems = [];
    this.createdItems = [];
  }
}