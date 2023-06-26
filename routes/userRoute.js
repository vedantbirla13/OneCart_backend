import express from "express"
import { upload } from "../multer.js";
import { createUser, getUser, loginUser, logoutUser, updateUser, updateAvatar, updateUserAddress, deleteUserAddress, changePassword } from "../controllers/user.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-user", upload.single("file"), createUser)

router.post("/login-user", loginUser)

router.get("/getUser", isAuthenticated, getUser)

router.get("/logoutUser", logoutUser)

router.put("/update-user-info", isAuthenticated, updateUser)

router.put("/update-avatar", isAuthenticated, upload.single("image") , updateAvatar)

router.put("/update-user-addresses", isAuthenticated, updateUserAddress)

router.delete("/delete-user-address/:id", isAuthenticated, deleteUserAddress)

router.put("/change-user-password", isAuthenticated, changePassword)

export default router