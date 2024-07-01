import express from "express";
const router = express.Router();


import productController from "../controllers/ProductController";
import { query } from "express-validator";

router.get("/search",query("searchTerm").trim().escape(),productController.searchProduct);
router.get("/recommendations",query("productId").isInt().toInt(),productController.fetchRecommendations);


export default router;