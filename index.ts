import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

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
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
