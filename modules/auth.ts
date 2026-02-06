import { Request, Response } from "express";
import { createId } from "@paralleldrive/cuid2";
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
  const stateUUID = createId();
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

  try {
    const response = await fetch("https://todoist.com/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: todoistClientId,
        client_secret: todoistClientSecret,
        code: code,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw errorData || response;
    }

    const data = await response.json();

    req.session.todoist_token = data.access_token;
    res.redirect("/");
  } catch (error) {
    console.log((error as any)?.error || error);
    // TODO: error redirect?
  }

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
