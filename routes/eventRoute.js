import express from "express"
import { upload } from "../multer.js";
import { createEvent, deleteEvent, getAllEventsShop, getAllEvents } from "../controllers/event.js";
import { isSellerAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-event", upload.array("images"), createEvent)

router.get("/get-all-events-shop/:id", getAllEventsShop)

router.delete("/delete-shop-event/:id" , isSellerAuthenticated, deleteEvent)

router.get("/get-all-events" , getAllEvents)

export default router;