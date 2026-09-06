import express, { Response, Request } from "express";
import cors from "cors";
import urlRoutes from "./routes/url.routes";


const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3001" }))



app.use("/api/v1", urlRoutes);

app.get("/health", (_req: Request, res : Response) => {
  res.json({ message: "Hello World! Health Check" });
});

export default app;