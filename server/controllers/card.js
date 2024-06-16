module.exports = function CardController(CardService) {
    return {
        create: async (req, res, next) => {
            try {
                const { body } = req;
                const card = await CardService.create(body);
                if (card) {
                    return res.status(201).json(card);
                } else {
                    res.sendStatus(400);
                }
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
        getUserReviewCards: async (req, res, next) => {
            try {
                const { userId } = req.params;
                const cards = await CardService.getUserReviewCards(userId);
                if (cards) res.status(200).json(cards);
                else res.sendStatus(404);
            } catch (error) {
                console.error(error);
                res.status(500).json(error);
            }
        },
        getCardsByCategory: async (req, res, next) => {
            try {
                const { userId, categoryName } = req.params;
                const cards = await CardService.getCardsByCategory(
                    userId,
                    categoryName
                );
                if (cards) res.status(200).json(cards);
                else res.sendStatus(404);
            } catch (error) {
                console.error(error);
                res.status(500).json(error);
            }
        },
        addTagsByCard: async (req, res, next) => {
            try {
                const cardId = req.body.cardId;
                const tagId = req.body.tagId;
                const cardTag = await CardService.addTagsByCard(cardId, tagId);
                return res.status(201).json(cardTag);
            } catch (error) {
                if (error.constructor.name === "ValidationError") {
                    res.status(422).json(error.errors);
                } else if (error.constructor.name === "UniqueConstraintError") {
                    res.status(409).json(error.errors);
                } else {
                    console.error(error);
                    res.status(500).json(error);
                }
            }
        },
        removeTagsByCard: async (req, res, next) => {
            try {
                const cardId = req.body.cardId;
                const tagId = req.params.tagId;
                const cardTag = await CardService.removeTagsByCard(
                    cardId,
                    tagId
                );
                res.status(204).json(cardTag);
            } catch (error) {
                console.error(error);
                res.status(500).json(error);
            }
        },
        getCardsByTags: async (req, res, next) => {
            try {
                const tags = req.query.tags;
                const userId = req.query.userId;
                const cards = await CardService.getCardsByTags(tags, userId);
                return res.status(200).json(cards);
            } catch (error) {
                console.error(error);

                res.status(500).json(error);
            }
        },
        getQuizz: async (req, res, next) => {
            try {
                const date = req.query.date;
                const userId = req.query.userId;
                const quizz = await CardService.getQuizz(userId, date);
                if (quizz) res.status(200).json(quizz);
                else res.sendStatus(404);
            } catch (error) {
                console.error(error);
                res.status(500).json(error);
            }
        },
        answerQuizz: async (req, res, next) => {
            try {
                const cardId = req.params.cardId;
                const { userId, isValid } = req.body;

                const result = await CardService.answerQuizz(
                    cardId,
                    userId,
                    isValid
                );
                if (result) res.status(204).json(result);
                else if (result === 0) res.sendStatus(404);
                else res.sendStatus(400);
            } catch (error) {
                console.error(error);
                res.status(500).json(error);
            }
        },
    };
};