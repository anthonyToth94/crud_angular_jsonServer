//Általános interface
export interface UserModel {
  id: string;
  username: string;
  password: string;
  roleId?: string; // '?' jelöli az opcionális tulajdonságot
  calendarId?: string
}

//Bejelentkezéshez használt interface
export interface LoginData {
  username: string;
  password: string;
}
