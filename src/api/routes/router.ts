import express from "express";
const router = express.Router();


import productController from "../controllers/ProductController";

router.get("/search", productController.searchProduct);
router.get("/recommendations", productController.fetchRecommendations);


export default router;