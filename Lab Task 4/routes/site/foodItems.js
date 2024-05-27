const express = require("express");
const router = express.Router();
const FoodItem = require("../../models/FoodItems");
const checkAuthenticated = require('../../middlewares/checkAuthenticated');

// Search functionality route
router.get("/landingPage/admin/dashboard/search", checkAuthenticated, async (req, res) => {
    try {
        let searchQuery = req.query.q;
        let page = Number(req.query.page) ? Number(req.query.page) : 1;
        let pageSize = 3;

        let query = {};
        if (searchQuery) {
            query = {
                $or: [
                    { name: { $regex: searchQuery, $options: "i" } },
                    { category: { $regex: searchQuery, $options: "i" } }
                ]
            };
        }

        let foodItems = await FoodItem.find(query)
            .skip(pageSize * (page - 1))
            .limit(pageSize);
        let totalFoodItems = await FoodItem.countDocuments(query);
        let totalPages = Math.ceil(totalFoodItems / pageSize);

        return res.render("adminSide/dashboard", {
            layout: false,
            pageTitle: "Search Results",
            foodItems,
            totalFoodItems,
            page,
            pageSize,
            totalPages,
            searchQuery
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error searching food items");
    }
});

// Existing routes
router.get("/landingPage/admin/dashboard/new", checkAuthenticated, (req, res) => {
    res.render("adminSide/addMeals", { layout: false });
});

router.post("/landingPage/admin/dashboard/new", checkAuthenticated, async (req, res) => {
    try {
        const { imageURL, name, price, category } = req.body;
        const newFoodItem = new FoodItem({ imageURL, name, price, category });
        await newFoodItem.save();
        return res.redirect("/landingPage/admin/dashboard/new");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error adding food item");
    }
});

router.get("/landingPage/admin/dashboard/:id/edit", checkAuthenticated, async (req, res) => {
    try {
        const foodItem = await FoodItem.findById(req.params.id);
        if (!foodItem) {
            return res.status(404).send("Food item not found");
        }
        return res.render("adminSide/editMeal", { layout: false, foodItem });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error fetching food item for editing");
    }
});

router.post("/landingPage/admin/dashboard/:id/edit", checkAuthenticated, async (req, res) => {
    try {
        let foodItem = await FoodItem.findById(req.params.id);
        if (!foodItem) {
            return res.status(404).send("Food item not found");
        }
        foodItem.imageURL = req.body.imageURL;
        foodItem.name = req.body.name;
        foodItem.price = req.body.price;
        foodItem.category = req.body.category;
        await foodItem.save();
        return res.redirect("/landingPage/admin/dashboard");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error editing food item");
    }
});

router.get("/landingPage/reviews", (req, res) => {
    res.render("reviews", { layout: false });
});

router.get("/landingPage/admin/dashboard/:id/delete", checkAuthenticated, async (req, res) => {
    try {
        await FoodItem.findByIdAndDelete(req.params.id);
        return res.redirect("/landingPage/admin/dashboard");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error deleting food item");
    }
});

router.get("/landingPage/admin/dashboard/:page?", checkAuthenticated, async (req, res) => {
    console.log("Inside admin dashboard route");
    try {
        let page = Number(req.params.page) ? Number(req.params.page) : 1;
        let pageSize = 3;
        let foodItems = await FoodItem.find()
            .skip(pageSize * (page - 1))
            .limit(pageSize);
        let totalFoodItems = await FoodItem.countDocuments();
        let totalPages = Math.ceil(totalFoodItems / pageSize);
        return res.render("adminSide/dashboard", {
            layout: false,
            pageTitle: "Available Food Items",
            foodItems,
            totalFoodItems,
            page,
            pageSize,
            totalPages,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error fetching food items");
    }
});

module.exports = router;
