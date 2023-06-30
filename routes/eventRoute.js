const express = require("express")
const { upload } = require("../multer.js");
const { createEvent, deleteEvent, getAllEventsShop, getAllEvents } = require("../controllers/event.js");
const { isSellerAuthenticated } = require("../middleware/auth.js");

const router = express.Router();

router.post("/create-event", upload.array("images"), createEvent)

router.get("/get-all-events-shop/:id", getAllEventsShop)

router.delete("/delete-shop-event/:id" , isSellerAuthenticated, deleteEvent)

router.get("/get-all-events" , getAllEvents)

module.exports = router;