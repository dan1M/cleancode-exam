const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const userController = require("../controllers/user");
const UserService = require("../services/user");

module.exports = new genericRouter(
    new genericController(new UserService(), {
        customController: userController,
    }),
    {
        customRoutes: [
            {
                handler: "login",
                method: "post",
                path: "/login",
                middleware: [],
            },
            {
                handler: "create",
                method: "post",
                path: "/register",
                middleware: [],
            },
        ],
        defaultRoutes: {
            getAll: {
                method: "get",
                path: "/",
                middleware: [],
                active: true,
            },
            getOne: {
                method: "get",
                path: "/:id",
                middleware: [],
                active: true,
            },
            update: {
                method: "put",
                path: "/:id",
                middleware: [],
                active: true,
            },
            delete: {
                method: "delete",
                path: "/:id",
                middleware: [],
                active: true,
            },
        },
        middlewares: [],
    }
);