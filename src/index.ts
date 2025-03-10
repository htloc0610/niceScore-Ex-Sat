import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 8080;

// Middleware để xử lý JSON
app.use(express.json());

app.get("/", (req: Request, res: Response): void => {
  res.json({ message: "OK" });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
