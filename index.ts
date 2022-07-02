import express from 'express';

const port = 3000;

import * as routes from './routes';

const app = express();

app.use(express.json());

routes.register(app);

// run server 
app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});