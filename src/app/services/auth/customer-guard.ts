import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStorageService } from '../storage/user-storage.service';

export const customerGuard: CanActivateFn = () => {
    const userStorage = inject(UserStorageService);
  const router = inject(Router);
  if (UserStorageService.isCustomerLoggedIn()) {
       return true;
  }
     router.navigate(['/login']);
    return false;
};
