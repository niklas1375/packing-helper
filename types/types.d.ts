import { SessionData } from "express-session";

declare module "express-session" {
  interface SessionData {
    state_token?: string;
    todoist_token?: string;
  }
}
