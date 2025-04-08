import { Router } from "express";
import User from "../models/User.schema.js"
import {
  addUser,
  deleteUser,
  updateUser,
  login,
  getUserById,
  ChangeAuthlevel,
} from "../services/userDataAccess.service.js";
import { validation } from "../../middlewares/validation.js";
import LoginSchema from "../validations/LoginSchema.js";
import RegisterSchema from "../validations/RegisterSchema.js";
import { generateToken } from "../../services/authService.js";
import { auth } from "../../middlewares/token.js";
import { isAdmin } from "../../middlewares/isAdmin.js";
import { isUser } from "../../middlewares/isUser.js";
import Product from "../models/product.schema.js"

const router = Router();


router.post("/register", validation(RegisterSchema), async (req, res) => {
  try {
    const data = req.body;
    const newUser = await addUser(data);

    return res.json({ message: "User Created", newUser });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});



router.post("/login", validation(LoginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    const tryLogin = await login(email, password);
    if (!tryLogin) {
      return res.status(404).send("User not found!");
    }
    const user = await User.findOne({ email });
    const token = generateToken(user);
    return res.send(token);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.get("/", auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.get("/:id", isUser, async (req, res) => {
  try {
    const user = await getUserById();
    return res.json(user);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.put("/:id", auth, isUser, async (req, res) => {
  try {
    const data = req.body;
    const user = await updateUser();
    return res.json(data);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.patch("/:id", auth, isUser, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await ChangeAuthlevel(id);
    return res.json({ message: "Auth Level updated", updatedUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", auth, isUser, async (req, res) => {
  try {
    const user = await deleteUser(req.params.id);
    return res.send("User Delete");
  } catch (err) {
    return res.status(500).send(err.message);
  }
});


router.get("/products", async (req, res) => {
  try {
    const products = await Product.find(); // מוציא את כל המוצרים מהמסד נתונים
    res.status(200).json(products); // מחזיר את המוצרים ללקוח
  } catch (err) {
    res.status(500).json({ error: "Server error" }); // אם יש שגיאה בשרת, מחזיר הודעת שגיאה
    console.log(err);
  }
});


router.post("/newproduct", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: "Bad request" });
    console.log(err);
    
  }
});



export default router;