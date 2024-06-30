export {};

declare global {
  namespace axios {
    interface AxiosResponse {
      success?: boolean;
      message?: string;
      pageInfo?: any;
      count?: number;
      data?: any;
      error?: any;
    }
  }
}

interface ButtonAction {
  type?:
    | 'primary'
    | 'secondary'
    | 'border'
    | 'border-1'
    | 'circle'
    | 'transparent'
    | 'no-text-1'
    | 'no-text-2'
    | 'text'
    | 'tab';
  className?: string;
  content?: any;
  onAction?: function;
  loading?: boolean;
  icon?: any;
}

interface Dialog {
  type?: 'success' | 'warning' | 'error' | 'help' | 'info';
  header?: any;
  content?: any;
  primaryLabel?: any;
  url?: any;
  onCancel?: function;
  onAccept?: function;
  loading?: boolean;
}
