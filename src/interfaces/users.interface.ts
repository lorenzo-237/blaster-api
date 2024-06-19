export interface UserRequest {
  id: number;
  username: string;
  token: string;
  lastVersionCreated: string;
  mantis: {
    user: {
      id: number;
      name: string;
    };
  };
}

export interface UserBlaster {
  id: number;
  username: string;
  password: string;
  token: string;
  lastVersionCreated: string;
  socket_id: string;
}
