import express from "express";
import "dotenv/config";

const port = 3000;

import * as routes from "./routes";

const app = express();

app.use(express.json());

const router = express.Router();
routes.register(router);
app.use("/api", router);

// run server
app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
