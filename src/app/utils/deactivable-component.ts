import { Observable } from 'rxjs';

export interface DeactivableComponent {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
