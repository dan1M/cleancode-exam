module.exports = (connection) => {
    const { DataTypes, Model } = require("sequelize");

    class Card extends Model {
        static associate(models) {
            this.belongsTo(models.User, {
                foreignKey: "userId",
                as: "user",
            });
            this.belongsToMany(models.Tag, {
                through: "cardTag",
                foreignKey: "cardId",
                as: "tags",
            });
        }
    }

    Card.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            category: {
                type: DataTypes.ENUM,
                values: [
                    "FIRST",
                    "SECOND",
                    "THIRD",
                    "FOURTH",
                    "FIFTH",
                    "SIXTH",
                    "SEVENTH",
                    "DONE",
                ],
                allowNull: false,
                defaultValue: "FIRST",
                validate: {
                    notNull: {
                        msg: "La catégorie est obligatoire",
                    },
                    isIn: {
                        args: [
                            [
                                "FIRST",
                                "SECOND",
                                "THIRD",
                                "FOURTH",
                                "FIFTH",
                                "SIXTH",
                                "SEVENTH",
                                "DONE",
                            ],
                        ],
                        msg: "La catégorie doit être FIRST, SECOND, THIRD, FOURTH, FIFTH, SIXTH, SEVENTH ou DONE",
                    },
                },
            },
            question: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "La question est obligatoire",
                    },
                },
            },
            answer: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "La réponse est obligatoire",
                    },
                },
            },
            lastReviewedAt: {
                type: DataTypes.DATE,
                allowNull: true,
                validate: {
                    isDate: {
                        args: true,
                        msg: "La date de révision doit être valide",
                    },
                },
            },
        },
        {
            sequelize: connection,
            tableName: "cards",
        }
    );

    Card.prototype.addTagsByCard = async function (tagId) {
        try {
            const tag = await this.sequelize.models.Tag.findByPk(tagId);
            if (!tag) {
                throw new Error("Le tag n'existe pas");
            }
            await this.addTag(tag);
        } catch (error) {
            throw error;
        }
    };

    Card.prototype.removeTagsByCard = async function (tagId) {
        try {
            const tag = await this.sequelize.models.Tag.findByPk(tagId);
            if (!tag) {
                throw new Error("Le tag n'existe pas");
            }
            await this.removeTag(tag);
        } catch (error) {
            throw error;
        }
    };

    Card.prototype.getTagsByCard = async function () {
        try {
            const tag = await this.sequelize.models.Card.findByPk(this.id, {
                include: ["tags"],
            });
            return tag.tags;
        } catch (error) {
            throw error;
        }
    };

    return Card;
};