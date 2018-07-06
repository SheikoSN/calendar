import { Subject, BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

export class TestCellsService {
   testCellsSubject: BehaviorSubject<any[]> = new BehaviorSubject(
    [
      { id: 'a', title: 'Test Cell A', selected: false },
      { id: 'b', title: 'Test Cell B', selected: false },
      { id: 'c', title: 'Test Cell C', selected: true },
      { id: 'd', title: 'Test Cell D', selected: true },
    ]
  );
  //TODO: Add models for all

  selectedTestCellsSource = this.testCellsSubject.pipe(map((cells: any[]) =>  cells.filter((cell) => cell.selected)));

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
