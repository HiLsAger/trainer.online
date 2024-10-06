export interface Label {
  title: string;
  placeholder?: string;
  templateType: string;
  type?: string;
  required?: boolean;
  tooltip?: string;
  max?: number;
  min?: number;
}

export interface loginLabels {
  login: Label;
  hash: Label;
}

export interface registerLabels {
  login: Label;
  hash: Label;
  name: Label;
}
