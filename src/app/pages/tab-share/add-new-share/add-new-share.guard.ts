import { DeactivableComponent } from 'src/app/utils/deactivable-component';
import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

@Injectable()
export class AddNewShareGuard implements CanDeactivate<DeactivableComponent> {
  canDeactivate(
    component: DeactivableComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return component.canDeactivate();
  }
}
