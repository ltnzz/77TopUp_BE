import express from "express";
import searchBar from "../controller/searchBarController.js";

const router = express.Router();

router.get("/search", searchBar);

export default router;