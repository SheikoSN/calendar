import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { TestCellInterface } from '../interfaces/test-cell.interface';
import {Observable} from "rxjs/Observable";

export class TestCellsService {
   public testCellsSubject: BehaviorSubject<TestCellInterface[]> = new BehaviorSubject(
    [
      { id: 'a', category: 'category 1 and yet and more', title: 'Test Cell A', selected: true },
      { id: 'b', category: 'category 1 and yet and more', title: 'Test Cell B', selected: true },
      { id: 'c', category: 'category 2 and yet and more', title: 'Test Cell C', selected: true },
      { id: 'd', category: 'category 2 and yet and more', title: 'Test Cell D and more and more', selected: false },
    ]
  );

  public selectedTestCellsSource = this.testCellsSubject.pipe(map((cells: any[]) =>  cells.filter((cell) => cell.selected)));

  toggleTestCell(id: string) {
    let currentValue = this.testCellsSubject.getValue();
    this.testCellsSubject.next(currentValue.map((testCell) => {
      if(testCell.id == id) {
        testCell.selected = !testCell.selected
      }
      return testCell;
    }))
  }
}
