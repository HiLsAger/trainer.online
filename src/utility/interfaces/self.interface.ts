export default interface Self {
  token: string;
  created: string;
  life_time: number;
  user: User;
}

export interface User {
  id: number;
  login: string;
  name: string;
}
