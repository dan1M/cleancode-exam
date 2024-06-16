const { Card, User, Tag, Response } = require("../db/models");
const Sequelize = require("sequelize");
const ValidationError = require("../errors/ValidationError");
const UniqueConstraintError = require("../errors/UniqueConstraintError");

module.exports = function CardService() {
    return {
        findAll: async function (filters, options) {
            let dbOptions = {
                where: filters,
                include: [
                    {
                        model: Tag,
                        as: "tags",
                        through: {
                            attributes: [],
                        },
                    },
                ],
            };
            if (options.order) {
                dbOptions.order = Object.entries(options.order);
            }
            if (options.limit) {
                dbOptions.limit = options.limit;
                dbOptions.offset = options.offset;
            }
            return Card.findAll(dbOptions);
        },
        findOne: async function (filters) {
            return Card.findOne({
                where: filters,
                include: [
                    {
                        model: Tag,
                        as: "tags",
                        through: {
                            attributes: [],
                        },
                    },
                ],
            });
        },
        create: async function (data) {
            try {
                const card = await Card.create(data);
                await Response.create({
                    isValid: false,
                    userId: card.userId,
                    cardId: card.id,
                    responseDate: new Date(),
                });

                return card;
            } catch (e) {
                if (e instanceof Sequelize.UniqueConstraintError) {
                    throw UniqueConstraintError.fromSequelizeUniqueConstraintError(
                        e
                    );
                }
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }

                throw e;
            }
        },
        replace: async function (filters, newData) {
            try {
                const nbDeleted = await this.delete(filters);
                const card = await this.create(newData);
                return [[card, nbDeleted === 0]];
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
                throw e;
            }
        },
        update: async (filters, newData) => {
            try {
                const [nbUpdated, cards] = await Card.update(newData, {
                    where: filters,
                    returning: true,
                    individualHooks: true,
                });
                return [nbUpdated, cards];
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSuserequelizeValidationError(e);
                }
                throw e;
            }
        },
        delete: async (filters) => {
            await Response.destroy({ where: { cardId: filters.id } });
            const card = Card.destroy({ where: filters });
            return card;
        },
        getUserReviewCards: async (userId) => {
            return Card.findAll({
                where: {
                    userId: userId,
                    lastReviewedAt: { [Sequelize.Op.ne]: null },
                    category: { [Sequelize.Op.ne]: "DONE" },
                },
                include: {
                    model: User,
                    as: "user",
                },
            });
        },
        getCardsByCategory: async (userId, categoryName) => {
            return Card.findAll({
                where: {
                    userId: userId,
                    category: {
                        [Sequelize.Op.eq]: categoryName,
                        [Sequelize.Op.ne]: "DONE",
                    },
                },
                include: {
                    model: User,
                    as: "user",
                },
            });
        },
        addTagsByCard: async function (cardId, tagId) {
            const card = await this.findOne({ id: cardId });
            if (!card) throw new Error("Fiche non trouvé");
            await card.addTagsByCard(tagId);
        },
        removeTagsByCard: async function (cardId, tagId) {
            const card = await this.findOne({ id: cardId });
            if (!card) throw new Error("Fiche non trouvé");
            await card.removeTagsByCard(tagId);
        },
        getCardsByTags: async function (tags, userId) {
            const user = await User.findByPk(userId);
            if (!user) throw new Error("Utilisateur non trouvé");

            if (tags) {
                const tagsArray = tags.split(",");

                const tagsIds = await Tag.findAll({
                    include: [
                        {
                            model: Card,
                            as: "cards",
                            through: {
                                attributes: [],
                            },
                        },
                    ],
                    where: {
                        name: {
                            [Sequelize.Op.in]: tagsArray,
                        },
                    },
                });

                return await Card.findAll({
                    include: [
                        {
                            model: Tag,
                            as: "tags",
                            through: {
                                attributes: [],
                            },
                        },
                    ],
                    where: {
                        id: {
                            [Sequelize.Op.in]: tagsIds
                                .map((tag) => tag.cards.map((card) => card.id))
                                .reduce((acc, val) =>
                                    acc.filter((x) => val.includes(x))
                                ),
                        },
                        userId: userId,
                        category: { [Sequelize.Op.ne]: "DONE" },
                    },
                });
            } else {
                return await Card.findAll({
                    include: ["tags"],
                    where: {
                        userId: userId,
                        category: { [Sequelize.Op.ne]: "DONE" },
                    },
                });
            }
        },
        getQuizz: async function (userId, date) {
            const user = await User.findByPk(userId);
            if (!user) throw new Error("Utilisateur non trouvé");

            if (!date) date = new Date();

            const responses = await Response.findAll({
                where: {
                    userId: userId,
                },
                attributes: [
                    "cardId",
                    [
                        Sequelize.fn("MAX", Sequelize.col("responseDate")),
                        "lastResponseDate",
                    ],
                ],
                group: ["cardId"],
            });


            const categoryDelays = {
                FIRST: 1,
                SECOND: 2,
                THIRD: 4,
                FOURTH: 8,
                FIFTH: 16,
                SIXTH: 32,
                SEVENTH: 64,
                DONE: Infinity,
            };

            const quizzCards = [];

            for (const response of responses) {
                const card = await Card.findByPk(response.cardId);
                if (!card) continue;

                console.log("card", card);
                const timeDifference = Math.floor(
                    (new Date(date) - response.dataValues.lastResponseDate) /
                        (1000 * 60 * 60 * 24)
                );

                const categoryDelay = categoryDelays[card.category];

                if (timeDifference >= categoryDelay) {
                    quizzCards.push(card);
                }
            }

            return quizzCards;
        },
        answerQuizz: async function (cardId, userId, isValid) {
            const card = await Card.findByPk(cardId);
            if (!card) throw new Error("Fiche non trouvée");

            const user = await User.findByPk(userId);
            if (!user) throw new Error("Utilisateur non trouvé");

            let response = await Response.findOne({
                where: {
                    userId: userId,
                    cardId: cardId,
                },
            });

            if (!response) {
                response = await Response.create({
                    isValid: isValid,
                    userId: userId,
                    cardId: cardId,
                    responseDate: new Date(),
                });
            }

            const allCategories = [
                "FIRST",
                "SECOND",
                "THIRD",
                "FOURTH",
                "FIFTH",
                "SIXTH",
                "SEVENTH",
            ];

            const currentIndex = allCategories.indexOf(card.category);
            const newCategory = allCategories[currentIndex + 1];

            if (isValid) {
                card.lastReviewedAt = new Date();
                card.category = newCategory;
            } else {
                card.lastReviewedAt = null;
                card.category = "FIRST";
            }

            await Promise.all([
                response.update({
                    isValid: isValid,
                    responseDate: new Date(),
                }),
                card.save(),
            ]);

            return response;
        },
    };
};