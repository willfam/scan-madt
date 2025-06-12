import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import User from '@dummyData/user.login';

export const AuthGuard: CanActivateFn = () => {
    const keys = localStorage.getItem('keys');
    if (keys === User?.sign) {
        return true;
    } else {
        inject(Router).navigate(['/sign-in']);
        return false;
    }
};
