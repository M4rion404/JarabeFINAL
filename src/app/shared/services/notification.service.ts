import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  success(message: string, title = 'Éxito') {
    this.toastr.success(message, title);
  }

  error(message: string, title = 'Error') {
    this.toastr.error(message, title);
  }

  info(message: string, title = 'Info') {
    this.toastr.info(message, title);
  }

  warning(message: string, title = 'Atención') {
    this.toastr.warning(message, title);
  }
}
