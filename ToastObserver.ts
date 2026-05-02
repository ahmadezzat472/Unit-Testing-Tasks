type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface IToastObserver {
  update(toast: Toast): void;
}

interface IToastSubject {
  subscribe(observer: IToastObserver): void;
  unSubscribe(observer: IToastObserver): void;
  notify(toast: Toast): void;
}

export class ToastService implements IToastSubject {
  private observers: Set<IToastObserver> = new Set();

  subscribe(observer: IToastObserver): void {
    this.observers.add(observer);
  }
  unSubscribe(observer: IToastObserver): void {
    this.observers.delete(observer);
  }
  notify(toast: Toast): void {
    this.observers.forEach((observer) => observer.update(toast));
  }

  show(message: string, type: ToastType = "info", duration = 3000): void {
    const toast: Toast = {
      id: crypto.randomUUID(),
      message,
      type,
      duration,
    };
    this.notify(toast);
  }
}

export class ToastLogger implements IToastObserver {
  update(toast: Toast): void {
    const prefix = `[Toast:${toast.type.toUpperCase()}]`;
    console.log(`${prefix} ${toast.message} (id: ${toast.id})`);
  }
}
