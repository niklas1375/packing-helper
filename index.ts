import express from "express";
import session from "express-session";
import "dotenv/config";

const port = 3000;

import * as routes from "./routes";

const app = express();

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
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

// run server
app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
