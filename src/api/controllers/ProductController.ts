import { Request, Response} from "express";
import Product from "../../db/models/Product";
import { Op } from "@sequelize/core";
import { WhereOptions } from "sequelize";
import ProductAttributes from "../../db/models/ProductAttributes";
import ProductVariants from "../../db/models/ProductVariants";
import { getRecommendations, initializeRecommenderData } from "../service/recommendationsService";

async function searchProduct(req:Request,res:Response) {
    try{
        const {searchTerm} = req.query;

        if (!searchTerm || typeof searchTerm !== "string") {
            return res.status(400).json({ message: "searchTerm is required and must be a string" });
        }

        // Split the search term into words
        const searchWords = searchTerm.toLowerCase().split(/\s+/).filter((word) => word.length > 2);

        if (searchWords.length === 0) {
            return res.status(400).json({message:"Search term must contain at least one word with more than 2 characters"});
        }

        const products = await Product.findAll({
                    attributes: [
                      "product_id",
                      "title",
                      "title_translated",
                      "gpt_description",
                      "image_urls",
                    ],
                    where: {
                      [Op.and]: searchWords.map((word) => ({
                        [Op.or]: [
                          { title: { [Op.iLike]: `%${word}%` } },
                          { title_translated: { [Op.iLike]: `%${word}%` } },
                          { keyword: { [Op.iLike]: `%${word}%` } },
                          { gpt_category_suggestion: { [Op.iLike]: `%${word}%` } },
                          { gpt_description: { [Op.iLike]: `%${word}%` } },
                          { product_label: { [Op.iLike]: `%${word}%` } },
                          { trending_label: { [Op.iLike]: `%${word}%` } },
                        ],
                      })),
                    } as WhereOptions<Partial<Product>>,
        });
            
        res.status(200).json(products);


    }catch(err){
        console.error(err);
        res.status(500).json({err});
    }
    
};

async function fetchRecommendations(req:Request,res:Response) {
    try{
        const {productId} = req.query;

        if (!productId) {
            return res.status(400).json({ message: "productId is required" });
        }

        const products = await Product.findAll();
        const attributes = await ProductAttributes.findAll();
        const variants = await ProductVariants.findAll();

        const recommenderData = initializeRecommenderData(products,attributes,variants);
        const recommendations = getRecommendations(Number(productId),recommenderData,0.5);

        res.status(200).json(recommendations);

    }catch(err){
        console.error(err);
        res.status(500).json({err});
    }
    
}

export default {
    searchProduct,
    fetchRecommendations
}