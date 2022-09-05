import express from "express";
import session from "express-session";
import "dotenv/config";
import { sessionSecret } from "./modules/secret-config";

import * as routes from "./routes";

const app = express();

app.use(express.json());

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: "auto",
      maxAge: 3600000,
    },
  })
);

const router = express.Router();
routes.register(router);
app.use("/api", router);
app.get("/", (_, res) => {
  res.json({
    message: "API is up and running.",
  });
});

export default app;
