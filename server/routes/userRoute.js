import express from "express";
import { saveUser, searchUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/save", saveUser);
router.post("/search", searchUser);

export default router;