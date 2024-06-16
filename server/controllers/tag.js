module.exports = function TagController(TagService) {
    return {
        create: async (req, res, next) => {
            try {
                const { body } = req;
                const tag = await TagService.create(body);
                return res.status(201).json(tag);
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
        getAllTagsByUser: async (req, res, next) => {
            try {
                const userId = req.params.userId;
                const tags = await TagService.getAllTagsByUser(userId);
                return res.status(200).json(tags);
            } catch (error) {
                console.error(error);
                res.status(500).json(error);
            }
        },
    };
};