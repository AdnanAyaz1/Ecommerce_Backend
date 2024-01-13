import express from "express";

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



// Error Handler
app.use(GlobalErrorHAndler);
