import axios from "axios";
import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import {
  todoistClientId,
  todoistClientSecret,
  todoistScopes,
} from "./secret-config";

export function loginRedirect(req: Request, res: Response) {
  if (req.session.todoist_token) {
    res.status(200);
    res.json({
      loggedIn: true,
    });
    return;
  }
  const stateUUID = uuid();
  req.session.state_token = stateUUID;
  res.json({
    loggedIn: false,
    client_id: todoistClientId,
    scopes: todoistScopes,
    state: stateUUID,
  });
}

export async function loginCallback(req: Request, res: Response) {
  const state = req.query.state;
  const code = req.query.code;
  if (state !== req.session.state_token) {
    res.status(400);
    res.json({
      message: "compromised request",
    });
    return;
  }

  await axios
    .post("https://todoist.com/oauth/access_token", {
      client_id: todoistClientId,
      client_secret: todoistClientSecret,
      code: code,
    })
    .then((response) => {
      req.session.todoist_token = response.data.access_token;
      res.redirect("/");
    })
    .catch((response) => {
      console.log(response.data?.error || response);
      // TODO: error redirect?
    });
}

export function logout(req: Request, res: Response) {
  req.session.destroy((err) => {
    console.log(err);
  });
  res.status(200);
  res.json({
    message: "ok",
  });
}
