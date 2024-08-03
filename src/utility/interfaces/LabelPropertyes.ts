export interface labelPropertyes {
  title: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  tooltip?: string;
  max?: number;
  min?: number;
}

export interface loginLabels {
  login: labelPropertyes;
  hash: labelPropertyes;
}

export interface registerLabels {
  login: labelPropertyes;
  hash: labelPropertyes;
  name: labelPropertyes;
}
