const ApiError = require("../error/ApiError");
const { Rating, Device } = require("../models/models");

class RatingController {
	async create(req, res) {
		try {
			const { userId, deviceId, rate } = req.body;
			if (!userId || !deviceId || !rate)
				return res.status(403).json({ message: "Not all parameters!" });
			const device = await Device.findOne({ where: { id: deviceId } });
			const checkUserRating = await Rating.findAndCountAll({
				where: { userId, deviceId },
			});
			if (checkUserRating.count == 0) {
				device.rating = device.rating + 1;
				await device.save();
				Rating.create({ userId, deviceId, rate });
				return res.json(device);
			}
			await Rating.destroy({ where: { userId, deviceId } });

			device.rating = device.rating - 1 !== -1 ? device.rating - 1 : 0;
			await device.save();

			return res.json(device);
		} catch (error) {
			ApiError.badRequest("Error with rating");
		}
	}
	async getOne(req, res, next) {
		const { deviceId } = req.params;
		const rating = await Rating.findAndCountAll({ where: { deviceId } });

		return res.json({ rating: rating.count });
	}
	async delete(req, res) {
		const { id } = req.params;
		await Rating.destroy({ where: { id } });
		return res.status(200).send("Rating deleted successfully");
	}
}

module.exports = new RatingController();
