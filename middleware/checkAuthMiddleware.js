module.exports = function (req, res, next) {
	if (req.method === "OPTIONS") next();
	try {
		const token = req.headers.authorization.split(" ")[1]; //Bearer token
		console.log(token);
		if (!token) throw new Error();

		next();
	} catch (error) {
		return res.status(401).json({ message: "Not authorized" });
	}
};
