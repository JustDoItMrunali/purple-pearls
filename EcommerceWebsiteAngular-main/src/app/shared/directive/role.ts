import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../auth/auth-service';

@Directive({
  selector: '[appRole]',
})
export class Role {
  private authService = inject(AuthService);
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);

  @Input() set appRole(allowedRoles: string | string[]) {
    const userRole = this.authService.getUserRole()?.toUpperCase();
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    this.viewContainer.clear();

    if (userRole && roles.includes(userRole)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
