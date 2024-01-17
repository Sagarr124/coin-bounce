const Joi = require("joi");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const RefreshToken = require("../models/token");
const UserDTO = require("../dto/user");
const JWTService = require("../services/JWTService");

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const authController = {
    async register(req, res, next) {
        const userRegisterSchema = Joi.object({
            username: Joi.string().min(5).max(30).required(),
            name: Joi.string().max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(passwordPattern).required(),
            confirmPassword: Joi.ref("password"),
        });

        const { error } = userRegisterSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { username, name, email, password } = req.body;
        try {
            const emailInUse = await User.exists({ email });
            const usernameInUse = await User.exists({ username });

            if (emailInUse) {
                const error = {
                    statusCode: 409,
                    message: "Email already registered, use another email",
                };
                return next(error);
            }

            if (usernameInUse) {
                const error = {
                    statusCode: 409,
                    message: "Username not available, choose another username",
                };
                return next(error);
            }
        } catch (error) {
            return next(error);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let user;
        let accessToken;
        let refreshToken;

        try {
            const userData = new User({
                username,
                name,
                email,
                password: hashedPassword,
            });

            user = await userData.save();

            accessToken = JWTService.signAccessToken({ _id: user._id }, "30m");

            refreshToken = JWTService.signRefreshToken(
                { _id: user._id },
                "60m"
            );
        } catch (error) {
            return next(error);
        }

        await JWTService.storeRefreshToken(refreshToken, user._id);

        res.cookie("accessToken", accessToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
        });

        res.cookie("refreshToken", refreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
        });

        const userDto = new UserDTO(user);

        return res.status(201).json({ user: userDto, auth: true });
    },

    async login(req, res, next) {
        const userLoginSchema = Joi.object({
            username: Joi.string().min(5).max(30).required(),
            password: Joi.string().pattern(passwordPattern).required(),
        });

        const { error } = userLoginSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { username, password } = req.body;
        let user;

        try {
            user = await User.findOne({ username });

            if (!user) {
                const error = {
                    statusCode: 401,
                    message: "Invalid username!",
                };

                return next(error);
            }

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                const error = {
                    statusCode: 401,
                    message: "Invalid password!",
                };

                return next(error);
            }
        } catch (error) {
            return next(error);
        }

        const accessToken = JWTService.signAccessToken(
            { _id: user._id },
            "30m"
        );
        const refreshToken = JWTService.signRefreshToken(
            { _id: user._id },
            "60m"
        );

        try {
            await RefreshToken.updateOne(
                { _id: user._id },
                { token: refreshToken },
                { upsert: true }
            );
        } catch (error) {
            return next(error);
        }

        res.cookie("accessToken", accessToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
        });

        res.cookie("refreshToken", refreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
        });

        const userDto = new UserDTO(user);

        return res.status(200).json({ user: userDto, auth: true });
    },

    async logout(req, res, next) {
        const { refreshToken } = req.cookies;

        try {
            await RefreshToken.deleteOne({ token: refreshToken });
        } catch (error) {
            return next(error);
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return res.status(200).json({ user: null, auth: false });
    },
    async refresh(req, res, next) {
        const originalRefreshToken = req.cookies.refreshToken;

        let id;

        try {
            id = JWTService.verifyRefreshToken(originalRefreshToken)._id;
        } catch (err) {
            const error = {
                statusCode: 401,
                message: "Unauthorized!",
            };

            return next(error);
        }

        try {
            const match = RefreshToken.findOne({
                _id: id,
                token: originalRefreshToken,
            });

            if (!match) {
                const error = {
                    statusCode: 401,
                    message: "Unauthorized!",
                };

                return next(error);
            }
        } catch (error) {
            return next(error);
        }

        try {
            const accessToken = JWTService.signAccessToken({ _id: id }, "30m");
            const refreshToken = JWTService.signRefreshToken(
                { _id: id },
                "60m"
            );

            RefreshToken.updateOne({ _id: id }, { token: refreshToken });

            res.cookie("accessToken", accessToken, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true,
            });

            res.cookie("refreshToken", refreshToken, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true,
            });
        } catch (error) {
            return next(error);
        }

        const user = await User.findOne({ _id: id });

        const userDto = new UserDTO(user);

        return res.status(200).json({ user: userDto, auth: true });
    },
};

module.exports = authController;
