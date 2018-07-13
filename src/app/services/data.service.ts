import { Observable, BehaviorSubject } from 'rxjs';
import { share } from 'rxjs/operators';
import { mockData } from './mockData';


export class DataService {
  private dataSubject: BehaviorSubject<any> = new BehaviorSubject([]);

  public dataSource: Observable<any> = new Observable((observer) => {
    this.dataSubject.subscribe((data) => {
      observer.next(data)
    })
  }).pipe(share());

  constructor() {
    setTimeout(() => {
      this.dataSubject.next(mockData)
    }, 5000)
  }
}
