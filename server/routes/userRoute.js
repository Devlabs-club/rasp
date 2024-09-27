import express from "express";
import { saveUser, searchUser, setUserStatus } from "../controllers/userController.js";

const router = express.Router();

router.patch("/save", saveUser);
router.post("/search", searchUser);
router.patch("/status", setUserStatus);

export default router;