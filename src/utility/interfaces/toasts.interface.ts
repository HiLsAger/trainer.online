export default interface Toasts {
    type: string;
    title: string;
    message: string;
    timer: number;
    maxTimer: number;
    show: boolean;
  }