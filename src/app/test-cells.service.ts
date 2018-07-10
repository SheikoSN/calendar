import { Subject, BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

export class TestCellsService {
   testCellsSubject: BehaviorSubject<any[]> = new BehaviorSubject(
    [
      { id: 'a', building: 'Test Cell A', title: 'Test Cell A', selected: true },
      { id: 'b', building: 'Test Cell A', title: 'Test Cell B', selected: true },
      { id: 'c', building: 'Test Cell A', title: 'Test Cell C', selected: true },
      { id: 'd', building: 'Test Cell A', title: 'Test Cell D', selected: true },
      { id: '1', building: 'Test Cell B', title: '1', selected: true },
      { id: '2', building: 'Test Cell B', title: '2', selected: true },
      { id: '3', building: 'Test Cell B', title: '3', selected: true },
      { id: '4', building: 'Test Cell B', title: '4', selected: true },
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
