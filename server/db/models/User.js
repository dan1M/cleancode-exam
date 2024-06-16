module.exports = connection => {
  const { DataTypes, Model } = require('sequelize');
  const bcrypt = require('bcryptjs');

  class User extends Model {
    isPasswordValid(password) {
      return bcrypt.compare(password, this.password);
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Le nom est obligatoire',
          },
          len: {
            args: [2, 50],
            msg: 'Le nom doit contenir entre 2 et 50 caractères',
          },
        },
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Le prénom est obligatoire',
          },
          len: {
            args: [2, 50],
            msg: 'Le prénom doit contenir entre 2 et 50 caractères',
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "L'email est déjà utilisé",
        },
        validate: {
          isEmail: {
            args: true,
            msg: "L'email doit être valide",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [8, 32],
          is: /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
          notNull: {
            msg: 'Le mot de passe est obligatoire',
          },
        },
      },
    },
    {
      sequelize: connection,
      tableName: 'users',
    },
  );

  function updatePassword(user) {
    return bcrypt.genSalt(10).then(salt =>
      bcrypt.hash(user.password, salt).then(hash => {
        user.password = hash;
      }),
    );
  }

  User.addHook('beforeCreate', async user => {
    return updatePassword(user);
  });

  return User;
};
