import { CatchAsyncErrors } from "../middleware/CatchAsyncErrors.js";
import Message from "../models/Message.js";
import ErrorHandler from "../utils/ErrorHandler.js";


export const createMessage = CatchAsyncErrors(async(req,res,next) => {
    try {
        const messageData = req.body

        if(req.files){ 
            const files = req.files;
            messageData.images = imageUrl
            const imageUrl = files.map((file) => `${file.fileName}`)
        }

        messageData.conversationId = req.body.conversationId
        messageData.sender = req.body.sender
        messageData.text = req.body.text

        const message = new Message({
            conversationId: messageData.conversationId,
            text: messageData.text,
            sender: messageData.sender,
            images: messageData.images ? messageData.images : undefined
        })

        await message.save();

        res.status(201).json({
            success: true,
            message
        })



    } catch (error) {
        return next(new ErrorHandler(error), 500)
    }
})

// Get messages
export const getMessages = CatchAsyncErrors(async(req,res,next) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.id
        });

        res.status(200).json({
            success: true,
            messages
        })
    } catch (error) {
        return next(new ErrorHandler(error), 500)
    }
})

