const express = require("express");
const router = express.Router();
const FoodItem = require("../../models/FoodItems");
const authenticateToken = require('../../middlewares/authenticateToken');
require('dotenv').config();

// GET all food items with pagination
router.get("/landingPage/admin/dashboard/:page?", authenticateToken, async (req, res) => {
    try {
        let page = Number(req.query.page) || 1;
        let pageSize = 3;
        let foodItems = await FoodItem.find()
            .skip(pageSize * (page - 1))
            .limit(pageSize);
        let totalFoodItems = await FoodItem.countDocuments();
        let totalPages = Math.ceil(totalFoodItems / pageSize);
        return res.status(200).send({ foodItems, totalFoodItems, page, pageSize, totalPages });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error fetching food items");
    }
});

// GET a single food item by ID
router.get("/landingPage/admin/dashboard/:id", authenticateToken, async (req, res) => {
    try {
        const foodItem = await FoodItem.findById(req.params.id);
        if (!foodItem) {
            return res.status(404).send("Food item not found");
        }
        return res.status(200).send(foodItem);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error fetching food item");
    }
});

// POST a new food item
router.post("/landingPage/admin/dashboard/new", authenticateToken, async (req, res) => {
    try {
        const { imageURL, name, price, category } = req.body;
        const newFoodItem = new FoodItem({ imageURL, name, price, category });
        await newFoodItem.save();
        return res.status(201).send(newFoodItem);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error adding food item");
    }
});

// PUT (update) a food item by ID
router.put("/landingPage/admin/dashboard/:id/edit", authenticateToken, async (req, res) => {
    try {
        const { imageURL, name, price, category } = req.body;
        const foodItem = await FoodItem.findByIdAndUpdate(req.params.id, { imageURL, name, price, category }, { new: true });
        if (!foodItem) {
            return res.status(404).send("Food item not found");
        }
        return res.status(200).send(foodItem);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error updating food item");
    }
});

// DELETE a food item by ID
router.delete("/landingPage/admin/dashboard/:id/delete", authenticateToken, async (req, res) => {
    try {
        const foodItem = await FoodItem.findByIdAndDelete(req.params.id);
        if (!foodItem) {
            return res.status(404).send("Food item not found");
        }
        return res.status(200).send("Food item deleted successfully");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error deleting food item");
    }
});

module.exports = router;
