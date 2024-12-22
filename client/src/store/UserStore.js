import { makeAutoObservable } from "mobx";
import { jwtDecode } from "jwt-decode";

export default class UserStore {
  constructor() {
    this._isAuth = false;
    this._user = {};
    makeAutoObservable(this);
  }

  async checkAuth() {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        this.setUser(decoded);
        this.setIsAuth(true);
        return decoded;
      } catch (error) {
        console.error("Token is invalid:", error);
        localStorage.removeItem("token");
        this.setIsAuth(false);
        this.setUser({});
        throw error;
      }
    } else {
      this.setIsAuth(false);
      this.setUser({});
      return null;
    }
  }

  setIsAuth(bool) {
    this._isAuth = bool;
  }

  setUser(user) {
    this._user = user;
  }

  get isAuth() {
    return this._isAuth;
  }

  get user() {
    return this._user;
  }

  get role() {
    return this._user.role || null;
  }
}
