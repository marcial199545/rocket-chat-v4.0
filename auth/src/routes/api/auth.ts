import express, { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { check, validationResult } from "express-validator";
import User from "../../models/User";
import jwt from "jsonwebtoken";
import config from "config";
import auth from "../../middleware/auth";

const router = Router();

// @route   POST api/auth
// @desc    Login, Authenticate user and get token
// @access  Public
router.post(
    "/",
    [
        check("email", "Please provide a valid email").isEmail(),
        check("password", "Password field is required").exists()
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        //NOTE check if the user does exist
        try {
            let user: any = await User.findOne({ email });
            if (!user) {
                res.clearCookie("token");
                return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
            }
            //NOTE comparing the password with the encrypted one
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.clearCookie("token");
                return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
            }
            //NOTE use json web token
            const payload = {
                id: user.id
            };
            const jwtConfig = {
                expiresIn: 360000
            };
            jwt.sign(payload, config.get("jwtSecret"), jwtConfig, (err, token) => {
                if (err) {
                    throw err;
                }
                res.cookie("token", token, { httpOnly: true });
                res.send("cookie sent");
            });
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error");
        }
    }
);

// @route   GET api/auth
// @desc    GET Current user
// @access  Public
router.get("/", auth, async (req: any, res: any) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

// @route   GET api/auth/me/id
// @desc    get the userId of the authenticated user
// @access  Private
router.get("/me/id", auth, async (req: any, res: any) => {
    try {
        const userID = await User.findById(req.user.id, { _id: 1 });
        res.json(userID);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

// @route   DELETE api/auth
// @desc    remove token
// @access  Public
router.delete("/", async (req, res) => {
    res.clearCookie("token");
    return res.status(200).send("cookie removed");
});

export default router;
