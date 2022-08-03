import { Router } from "express";
import { auth } from "../modules";

export const register = (app: Router) => {
  app.post("/auth/login", auth.loginRedirect);
  app.get("/auth/oauth-callback", auth.loginCallback);
  app.get('/auth/logout', auth.logout);
};
