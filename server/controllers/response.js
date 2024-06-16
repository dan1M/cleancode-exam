module.exports = function ResponseController(ResponseService) {
    return {
        create: async (req, res, next) => {
            try {
                const { body } = req;
                const response = await ResponseService.create(body);
                return res.status(201).json(response);
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
        getResponsesByCard: async (req, res, next) => {
            try {
                const { cardId, userId } = req.params;
                const responses = await ResponseService.getResponsesByCard(
                    cardId,
                    userId
                );
                if (responses) res.json(responses);
                else res.sendStatus(404);
            } catch (error) {
                console.error(error);
                next(error);
            }
        },
        checkResponseValidity: async (req, res, next) => {
            try {
                const { cardId, userId } = req.body;
                const response =
                    await ResponseService.checkResponseValidity(
                        cardId,
                        userId
                    );
                if (response) res.json(response);
                else res.sendStatus(404);
            } catch (error) {
                console.error(error);
                next(error);
            }
        },
    };
};