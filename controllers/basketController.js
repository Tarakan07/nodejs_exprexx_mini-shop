const ApiError = require("../error/ApiError");
const { Basket, BasketDevice } = require("../models/models");

class BasketController {
	async getBasket(req, res, next) {
		try {
			const { userId } = req.params;
			const basket = await Basket.findOne({
				where: { userId },
				include: [{ model: BasketDevice, as: "basketUser" }],
			});
			const countBasketDevice = await BasketDevice.findAndCountAll({
				where: { basketId: basket.id },
			});
			return res.json({ basket, count: countBasketDevice.count });
		} catch (error) {
			return next(ApiError.badRequest("No all parameters"));
		}
	}
	async create(req, res, next) {
		try {
			const { userId, devicesId } = req.body;
			const basket = await Basket.findOne({
				where: { userId },
			});
			if (!userId || !devicesId) next(ApiError.badRequest("No all parameters"));
			const parseDevicesId = JSON.parse(devicesId);
			parseDevicesId.forEach((device) => {
				console.log(device);
				BasketDevice.create({
					basketId: basket.id,
					deviceId: device,
				});
			});

			return res.json({ message: "Successfully added" });
		} catch (error) {
			next(ApiError.badRequest(error));
		}
	}
	async delete(req, res, next) {
		try {
			const { userId, devicesId } = req.body;
			if (!userId) next(ApiError.badRequest("No all parameters"));
			const basket = await Basket.findOne({
				where: { userId },
			});
			if (!devicesId) {
				await BasketDevice.destroy({ where: { basketId: basket.id } });
				return res.json({ message: "Successfully deleted" });
			}
			const parseDevicesId = JSON.parse(devicesId);
			parseDevicesId.forEach((device) => {
				BasketDevice.destroy({
					where: {
						basketId: basket.id,
						deviceId: device,
					},
				});
			});
			return res.json({ message: "Successfully deleted" });
		} catch (error) {
			next(ApiError.badRequest(error));
		}
	}
}

module.exports = new BasketController();
