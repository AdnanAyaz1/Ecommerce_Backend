import mongoose from "mongoose";
import { app } from "./app.js";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import {v2 as cloudinary} from 'cloudinary'

cloudinary.config({ 
  cloud_name: 'drlzlx6tg', 
  api_key: '281976563949252', 
  api_secret: 'fI-uwH-4UqFaR_FPMx-4x96p0qs' 
});


const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log("Listening on PORT", port);
});

const connect_DB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connection Established");
  } catch (error) {
    console.log("Connection Failed", error.message);
  }
};

connect_DB();
