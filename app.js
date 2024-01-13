import express from "express";
import ProductsRouter from "./Routes/ProductsRoutes.js";
import UserRouter from "./Routes/UserRoutes.js";
import OrderRouter from "./Routes/OrderRoutes.js";
import { GlobalErrorHAndler } from "./Utils/GlobalErrorHandler.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cors from "cors";
import bodyParser from "body-parser";
export const app = express();

// parsing
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.use(cors({}));
// const __dirname = path.dirname(new URL(import.meta.url).pathname);

// app.use(express.static(path.join(__dirname, "./client/dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "./client/dist/index.html"));
// });

// Routes
app.use("/api/products", ProductsRouter);
app.use("/api/users", UserRouter);
app.use("/api/orders", OrderRouter);

// Error Handler
app.use(GlobalErrorHAndler);
