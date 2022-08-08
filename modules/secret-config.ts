import fs from "fs";

let todoistClientId: string,
  todoistClientSecret: string,
  todoistScopes: string,
  sessionSecret: string,
  fallbackTodoistApiToken: string;

if (process.env.CONTAINER_RUN && process.env.CONTAINER_RUN == "1") {
  // running in container setup with secrets
  fallbackTodoistApiToken = read("fallbackTodoistApiToken");
  todoistClientId = read("todoistClientId");
  todoistClientSecret = read("todoistClientSecret");
  todoistScopes = read("todoistScopes");
  sessionSecret = read("sessionSecret");
} else {
  // running locally with .env
  fallbackTodoistApiToken = "" + process.env.TODOIST_API_TOKEN;
  todoistClientId = "" + process.env.TODOIST_CLIENT_ID;
  todoistClientSecret = "" + process.env.TODOIST_CLIENT_SECRET;
  todoistScopes = "" + process.env.TODOIST_SCOPES;
  sessionSecret = "" + process.env.SESSION_SECRET;
}

function read(secretName: string): string {
  try {
    return fs.readFileSync(`/run/secrets/${secretName}`, "utf8");
  } catch (err: any) {
    if (err["code" as keyof {}] !== "ENOENT") {
      console.error(
        `An error occurred while trying to read the secret: ${secretName}. Err: ${err}`
      );
    } else {
      console.debug(
        `Could not find the secret, probably not running in swarm mode: ${secretName}. Err: ${err}`
      );
    }
    return "";
  }
}

export { fallbackTodoistApiToken, todoistClientId, todoistClientSecret, todoistScopes, sessionSecret };
