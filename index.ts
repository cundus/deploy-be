import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
import { uploadCloudinary } from "./cloudinary";

const client = new PrismaClient();
import {
   v2 as cloudinary,
   UploadApiResponse,
   UploadApiErrorResponse,
} from "cloudinary";

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_SECRET,
});

interface CloudinaryFile extends Express.Multer.File {
   buffer: Buffer;
}

const storage = multer.memoryStorage();

const upload = multer({ storage });

const app = express();
const port = 3000;

app.use(cors());

app.get("/", async (req, res) => {
   const users = await client.user.findMany({
      orderBy: {
         id: "desc",
      },
   });

   res.send(users[0].name);
});

app.post(
   "/upload",
   upload.single("file"),
   uploadCloudinary,
   async (req, res) => {
      try {
         const file = res.locals.image;
         const newUser = await client.user.create({
            data: {
               name: file,
               age: 0,
            },
         });

         res.send(newUser.name);
      } catch (error) {
         console.error(error);
         res.send("Error uploading image");
      }
   }
);

app.get("/users", async (req, res) => {
   const users = await client.user.findMany({
      orderBy: {
         id: "desc",
      },
   });
   res.send(users);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
