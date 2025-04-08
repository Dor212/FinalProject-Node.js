import express from 'express';
import router from './router/router.js';
import chalk from 'chalk';
import { morganLogger } from './middlewares/morganLogger.js';
import { badPathHandler } from './middlewares/badPathHandler.js';
import { ErrorHandler } from './middlewares/errorHandler.js';
import { conn } from './services/db.services.js';
import User from "./users/models/User.schema.js";
import usersSeed from "./users/initialData/initialUsers.json" with {type: "json"};
import cors from "cors";
import seedCards from './cards/initialData/cardsSeed.js';
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const { SERVER } = process.env;
const PORT = SERVER;
app.use(cors({ origin: "*" })); 
const basePath = path.join(__dirname, "public", "sketchesTattoo");


app.get("/api/gallery/:category", cors(), (req, res) => {
    const { category } = req.params;
    const categoryPath = path.join(basePath, category);

    console.log("Category Path:", categoryPath);

    if (!fs.existsSync(categoryPath)) {
        console.log("Category not found:", category);
        return res.status(404).json({ error: "Category not found" });
    }

    fs.readdir(categoryPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Error reading folder" });
        }

        const images = files.map(file => `/sketchesTattoo/${category}/${file}`);
        
        res.setHeader("Access-Control-Allow-Origin", "*");
        
        res.json(images);
    });
});


app.use("/sketchesTattoo", express.static(path.join(__dirname, "public", "sketchesTattoo")));


app.use(express.json({ limit: "5mb" }));

app.use(morganLogger);


app.use(express.static('public'));

app.use(router);

app.use(badPathHandler);

app.use(ErrorHandler);

app.get("/api/test", (req, res) => {
  res.json({ message: "החיבור בין השרת ללקוח עובד!" });
});


app.listen(PORT, async () => {
  console.log(chalk.blue(`Server is running on port ${PORT}`));
  await conn();
  await seedCards();
  const usersFromDb = await User.find();
  
  try {
    usersSeed.forEach(async(user)=>{
        if(usersFromDb.find((dbUser)=> dbUser.email === user.email)){
            return;
        }
        const newUser = new User(user);
        await newUser.save();
    });
    
    
  } catch (err) {
    console.log(err);
    
  }
});

