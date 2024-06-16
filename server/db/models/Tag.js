module.exports = (connection) => {
    const { DataTypes, Model } = require("sequelize");

    class Tag extends Model {
        static associate(models) {
            this.belongsToMany(models.Card, {
                through: "cardTag",
                foreignKey: "tagId",
                as: "cards",
            });
            this.belongsTo(models.User, {
                foreignKey: "userId",
                as: "user",
            });
        }
    }

    Tag.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Le nom du tag est obligatoire",
                    },
                },
            },
        },
        {
            sequelize: connection,
            tableName: "tags",
        }
    );

    return Tag;
};