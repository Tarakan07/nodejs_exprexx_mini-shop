const ApiError = require("../error/ApiError");
const { User, Basket } = require("../models/models");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateJwt = ({ id, email, role }) => {
	return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
		expiresIn: "24h",
	});
};
class UserController {
	async registration(req, res, next) {
		const { email, password, role } = req.body;
		if (!email || !password) {
			return next(ApiError.badRequest("Incorrect email of password"));
		}
		const candidate = await User.findOne({ where: { email } });
		if (candidate) {
			return next(ApiError.badRequest("User existse"));
		}
		const hashPassword = await bcrypt.hash(password, 5);
		const user = await User.create({ email, role, password: hashPassword });
		const basket = await Basket.create({ userId: user.id });
		const token = generateJwt({
			id: user.id,
			email: user.email,
			role: user.role,
		});

		return res.json({ token: token });
	}
	async login(req, res, next) {
		const { email, password } = req.body;
		const user = await User.findOne({ where: { email } });
		if (!user) return next(ApiError.badRequest("User does not exist"));

		let comparePassword = bcrypt.compareSync(password, user.password);
		if (!comparePassword)
			return next(ApiError.badRequest("Incorrect password"));
		const token = generateJwt({
			id: user.id,
			email: user.email,
			role: user.role,
		});
		return res.json({ token });
	}
	async check(req, res, next) {
		const token = generateJwt({
			id: req.user.id,
			email: req.user.email,
			role: req.user.role,
		});
		return res.json({
			token,
			id: req.user.id,
			email: req.user.email,
			role: req.user.role,
		});
	}
}

module.exports = new UserController();
