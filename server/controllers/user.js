module.exports = function UserController(UserService) {
    return {
        login: async (req, res, next) => {
            try {
                const { email, password } = req.body;
                const user = await UserService.login(email, password);
                res.status(200).json(user);
            } catch (err) {
                console.error(err);
                if (err.name === "UnauthorizedError") {
                    res.status(401).json(err.errors);
                } else {
                    next(err);
                }
            }
        },
        create: async (req, res, next) => {
            try {
                const { body } = req;
                const user = await UserService.create(body);
                return res.status(201).json(user);
            } catch (error) {
                if (error.constructor.name === "ValidationError") {
                    res.status(422).json(error.errors);
                } else if (error.constructor.name === "UniqueConstraintError") {
                    res.status(409).json(error.errors);
                } else {
                    console.error(error);
                    next(error);
                }
            }
        },
    };
};