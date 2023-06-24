import Event from "../models/Event.js";
import Shop from "../models/Shop.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import {CatchAsyncErrors} from "../middleware/CatchAsyncErrors.js"


// Create event
export const createEvent = CatchAsyncErrors(async(req,res,next) => {
    try {
        const shopId = req.body.shopId
        const shop = await Shop.findById(shopId);
        if(!shop) {
            return next(new ErrorHandler("Shop Id is invalid!!", 401));
        }else{
            const files = req.files;
            const imageUrls = files.map((file) => `${file.filename}`)
            const eventData = req.body;
            eventData.images = imageUrls;
            eventData.shop = shop;

            const event = await Event.create(eventData);

            res.status(201).json({
                success: true,
                event,
            })
            
        }
    } catch (error) {
        return next(new ErrorHandler(error, 400))
    }
})

// Get all events
export const getAllEventsShop = CatchAsyncErrors(async(req,res,next) => {
    try {
        const events = await Event.find({ shopId: req.params.id })

        res.status(201).json({
            success: true,
            events
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
})

// Delete a event
export const deleteEvent = CatchAsyncErrors(async(req,res,next) => {
    try {
        const eventId = req.params.id;

        const eventData = await Event.findById(eventId)
        eventData.images.forEach((imageUrl) => {
            const filename = imageUrl;
            const filepath = `uploads/${filename}`

            fs.unlink(filepath, (err) => {
                if(err) {
                    console.log(err);
                }
            })
        })

        const event = await Event.findByIdAndDelete(eventId)

        if(!event){
            return next(new ErrorHandler("Event not found", 404))
        }

        res.status(200).json({
            success: true,
            message: "Event deleted successfully"
        })
    } catch (error) {
        return next (new ErrorHandler(error.message, 400))
    }
}) 

// Get all events
export const getAllEvents = CatchAsyncErrors(async(req,res,next) => {
    try {
        const events = await Event.find();

        res.status(200).json({
            success: true,
            events
        })
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
    }
}) 