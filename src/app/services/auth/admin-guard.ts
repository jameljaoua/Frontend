import { CanActivateFn, Router } from '@angular/router';
import { UserStorageService } from '../storage/user-storage.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = () => {
  const userStorage = inject(UserStorageService);
  const router = inject(Router);
  if (UserStorageService.isAdminLoggedIn()) {
       return true;
  }
     router.navigate(['/login']);
    return false;
};
