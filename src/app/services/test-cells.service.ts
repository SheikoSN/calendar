import { Subject, BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

export class TestCellsService {
   testCellsSubject: BehaviorSubject<any[]> = new BehaviorSubject(
    [
      { id: 'a', category: 'category 1 and yet and more', title: 'Test Cell A', selected: true },
      { id: 'b', category: 'category 1 and yet and more', title: 'Test Cell B', selected: true },
      { id: 'c', category: 'category 2 and yet and more', title: 'Test Cell C', selected: true },
      { id: 'd', category: 'category 2 and yet and more', title: 'Test Cell D and more and more', selected: false },
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
