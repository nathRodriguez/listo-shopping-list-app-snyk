import Swal from 'sweetalert2';

export class NotificationService {
    static showSuccess(title: string, text?: string, timer?: number) {
        return Swal.fire({
            icon: 'success',
            title,
            text,
            timer: timer || 2000,
            showConfirmButton: false,
        });
    }

    static showError(title: string, text?: string) {
        return Swal.fire({
            icon: 'error',
            title,
            text,
        });
    }

    static showWarning(title: string, text?: string) {
        return Swal.fire({
            icon: 'warning',
            title,
            text,
        });
    }

    static showInfo(title: string, text?: string) {
        return Swal.fire({
            icon: 'info',
            title,
            text,
        });
    }
}