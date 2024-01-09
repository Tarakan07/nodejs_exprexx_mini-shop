const { Type } = require("../models/models");
const ApiError = require("../error/ApiError");

class TypeController {
	async create(req, res) {
		const { name } = req.body;
		const type = await Type.create({ name });
		return res.json(type);
	}
	async delete(req, res, next) {
		const { id } = req.params;
		await Type.destroy({ where: { id } });
		return res.status(200).send("Type deleted successfully");
	}
	async getAll(req, res) {
		const types = await Type.findAll();
		return res.json(types);
	}
}

module.exports = new TypeController();
