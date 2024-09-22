import express from "express";
const router = express.Router();
import { createNewAccount } from "../controllers/campus-connect.controller";

router.post("/user", createNewAccount);

router.post("/user/login", userLogin);

module.exports = router;
