import { Router } from "express";
import usersRouter from "../users/routes/user.routes.js";
import cardsRouter from "../cards/routes/card.routes.js"
import { auth } from "../middlewares/token.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { upload } from "../middlewares/upload.js";
import path from "path";

const router = Router();



router.get("/", (req, res) => {
    return res.json({ message: "Router is working" });
});

router.get("/logs/:date",auth, isAdmin, (req, res) => {
    try{
        const {date} = req.params;
        return res.sendFile(path.join(process.cwd(),'logs',`${date}.txt`));
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
});

router.post("/upload",auth, upload , async(req, res) => {
    try{
        return res.json({ message: "File Upload", file: req.filename});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
});



router.use("/users", usersRouter);
router.use("/cards", cardsRouter);


export default router;