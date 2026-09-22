const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const SERPAPI_KEY = process.env.SERPAPI_KEY;

// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "PriceWise backend is running"
    });
});

// Price comparison route
app.get("/api/compare", async (req, res) => {
    try {
        const product = req.query.product;

        if (!product) {
            return res.status(400).json({
                success: false,
                message: "Product name is required"
            });
        }

        if (!SERPAPI_KEY) {
            return res.status(500).json({
                success: false,
                message: "SERPAPI_KEY is not configured"
            });
        }

        console.log("Searching for:", product);

        const response = await axios.get(
            "https://serpapi.com/search",
            {
                params: {
                    engine: "google_shopping",
                    q: product,
                    api_key: SERPAPI_KEY,
                    gl: "in",
                    hl: "en",
                    location: "India"
                }
            }
        );

        const shoppingResults =
            response.data.shopping_results || [];

        const products = shoppingResults
            .map((item) => {
                const price =
                    Number(item.extracted_price) ||
                    Number(
                        String(item.price || "")
                            .replace(/[^\d.]/g, "")
                    );

                return {
                    title: item.title || "Unknown Product",
                    store: item.source || "Unknown Store",
                    price: Number.isFinite(price)
                        ? price
                        : null,
                    link: item.product_link || "#",
                    rating: item.rating || null,
                    reviews: item.reviews || null,
                    delivery: item.delivery || "",
                    thumbnail: item.thumbnail || ""
                };
            })
            .filter(item => item.price !== null);

        // Keep only the cheapest result from each store
        const storeMap = new Map();

        for (const item of products) {
            const existing = storeMap.get(item.store);

            if (!existing || item.price < existing.price) {
                storeMap.set(item.store, item);
            }
        }

        const comparisons =
            Array.from(storeMap.values())
                .sort((a, b) => a.price - b.price);

        if (comparisons.length === 0) {
            return res.json({
                success: true,
                product: product,
                bestPrice: null,
                savings: 0,
                comparisons: []
            });
        }

        const bestPrice = comparisons[0];

        const highestPrice =
            comparisons[comparisons.length - 1].price;

        const savings =
            highestPrice - bestPrice.price;

        res.json({
            success: true,
            product: product,
            bestPrice: bestPrice,
            savings: savings,
            comparisons: comparisons
        });

    } catch (error) {

        console.error(error.message);

        res.status(500).json({
            success: false,
            message: "Unable to fetch product prices",
            error: error.response?.data || error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(
        `PriceWise server running at http://localhost:${PORT}`
    );
});