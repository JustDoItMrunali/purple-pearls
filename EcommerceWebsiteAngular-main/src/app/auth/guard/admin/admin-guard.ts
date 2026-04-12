import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth-service';
import { map, take } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.currentUser$.pipe(
    take(1),
    map((user)=>{
      if(!user){
        return router.createUrlTree(['/auth/login'],{
          queryParams:{returnUrl: state.url}
        });
      }
      if(user.role !== 'ADMIN'){
        return router.createUrlTree(['/admin']);
      }
      return true;
    })
  )
};
