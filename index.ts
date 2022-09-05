import app from './app';

const port = 3000;

// run server
app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
