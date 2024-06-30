import { createReadStream } from "fs";
import csvParser = require("csv-parser");
import sequelize from "./db_config"; // Ensure your sequelize instance is correctly imported
import Product from "./models/Product"; // Ensure your Product model is correctly imported
import path from "path";
import ProductVariants from "./models/ProductVariants";
import ProductAttributes from "./models/ProductAttributes";

// Use process.cwd() to get the current working directory (root of the project)
const rootDir = process.cwd();

const products_path = path.join(
  rootDir,
  "data",
  "forexternal_products.csv"
);

const products_variant_path = path.join(
  rootDir,
  "data",
  "forexternal_product_variants.csv"
);

const products_attributes_path = path.join(
  rootDir,
  "data",
  "forexternal_product_attributes.csv"
);

async function seedProduct() {
  const results: Array<Partial<Product>> = [];

  const promise = new Promise<boolean>((resolve, reject) => {
    createReadStream(products_path)
      .pipe(csvParser())
      .on("data", (data) =>
        results.push({
          product_id: parseInt(data.product_id, 10),
          scrape_product_id: parseInt(data.scrape_product_id, 10),
          platform_id: parseInt(data.platform_id, 10),
          supplier_id: parseInt(data.supplier_id, 10),
          stock_count: parseInt(data.stock_count, 10),
          repurchase_rate: parseFloat(data.repurchase_rate),
          is_validated: data.is_validated.toLowerCase() === "true",
          is_catalogued: data.is_catalogued.toLowerCase() === "true",
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          stock_units: data.stock_units,
          keyword: data.keyword,
          link: data.link,
          title_translated: data.title_translated,
          gpt_category_suggestion: data.gpt_category_suggestion,
          gpt_description: data.gpt_description,
          product_label: data.product_label,
          trending_label: data.trending_label,
          title: data.title,
          image_urls: data.image_urls,
        })
      )
      .on("end", async () => {
        try {
          await Product.bulkCreate(results);

          resolve(true);
        } catch (error) {
          console.error("Failed to seed database:", error);
          reject(false);
        }
      });
  });

  return promise;
}

async function seedProductVariants() {
  const results: Array<Partial<ProductVariants>> = [];

  const promise = new Promise<boolean>((resolve, reject) => {
    createReadStream(products_variant_path)
      .pipe(csvParser())
      .on("data", (data) =>
        results.push({
          product_id: parseInt(data.product_id, 10),
          product_variant_id: parseInt(data.product_variant_id, 10),
          scrape_product_variant_id: parseInt(
            data.scrape_product_variant_id,
            10
          ),
          stock_count: parseInt(data.stock_count, 10),
          price: parseFloat(data.price),
          weight_per_unit_kg: parseFloat(data.weight_per_unit_kg),
          length_cm: parseFloat(data.length_cm),
          width_cm: parseFloat(data.width_cm),
          height_cm: parseFloat(data.height_cm),
          product_variant_key: data.product_variant_key,
          price_currency: data.price_currency,
          stock_units: data.stock_units,
          is_validated: data.is_validated.toLowerCase() === "true",
          is_catalogued: data.is_catalogued.toLowerCase() === "true",
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        })
      )
      .on("end", async () => {
        try {
          await ProductVariants.bulkCreate(results);

          resolve(true);
        } catch (error) {
          console.error("Failed to seed database:", error);
          reject(false);
        }
      });
  });

  return promise;
}

async function seedProductAttributes() {
  const results: Array<Partial<ProductAttributes>> = [];

  const promise = new Promise<boolean>((resolve, reject) => {
    createReadStream(products_attributes_path)
      .pipe(csvParser())
      .on("data", (data) =>
        results.push({
          product_id: parseInt(data.product_id, 10),
          product_attribute_id: parseInt(data.product_attribute_id, 10),
          scrape_product_attribute_id: parseInt(
            data.scrape_product_attribute_id,
            10
          ),
          product_attribute_key: data.product_attribute_key,
          product_attribute_value: data.product_attribute_value,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        })
      )
      .on("end", async () => {
        try {
          await ProductAttributes.bulkCreate(results);

          resolve(true);
        } catch (error) {
          console.error("Failed to seed database:", error);
          reject(false);
        }
      });
  });

  return promise;
}

async function seedDatabase() {
  try {
    await sequelize.sync({ force: true });
    await seedProduct();
    await seedProductVariants();
    await seedProductAttributes();

    console.log("======================");
    console.log("Database seeded successfully!");
    console.log("======================");
  } catch (error) {
    console.log(error);
  } finally {
    await sequelize.close();
  }
}

seedDatabase();
