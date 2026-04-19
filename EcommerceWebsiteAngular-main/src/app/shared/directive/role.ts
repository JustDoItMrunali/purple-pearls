import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../auth/auth-service';

@Directive({
  selector: '[appRole]',
  standalone: true,
})
export class Role {
  private authService = inject(AuthService);
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);

  @Input() set appRole(allowedRole: 'admin' | 'user') {
    const userRole = this.authService.getUserRole();

    this.viewContainer.clear();

    if (userRole === allowedRole) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
