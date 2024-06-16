module.exports = (connection) => {
    const { DataTypes, Model } = require("sequelize");

    class Response extends Model {
        static associate(models) {
            this.belongsTo(models.User, {
                foreignKey: "userId",
                as: "user",
            });
            this.belongsTo(models.Card, {
                foreignKey: "cardId",
                as: "card",
            });
        }
    }

    Response.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            isValid: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "La validation est obligatoire",
                    },
                },
            },
            responseDate: {
                type: DataTypes.DATE,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "La date de réponse est obligatoire",
                    },
                },
            },
        },
        {
            sequelize: connection,
            tableName: "Response",
        }
    );
    return Response;
};