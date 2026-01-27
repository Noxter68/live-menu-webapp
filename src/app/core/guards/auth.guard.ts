import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getToken()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.getToken()) {
    return true;
  }

  const role = authService.getRole();
  if (role === 'admin') {
    router.navigate(['/admin']);
  } else {
    router.navigate(['/dashboard']);
  }
  return false;
};

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.getToken()) {
    router.navigate(['/login']);
    return false;
  }

  const role = authService.getRole();
  if (role !== 'admin') {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};

export const restaurantGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.getToken()) {
    router.navigate(['/login']);
    return false;
  }

  const role = authService.getRole();
  if (role !== 'restaurant') {
    router.navigate(['/admin']);
    return false;
  }

  return true;
};
