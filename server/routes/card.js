const genericRouter = require("./generic");
const genericController = require("../controllers/generic");
const cardController = require("../controllers/Card");
const CardService = require("../services/card");

module.exports = new genericRouter(
    new genericController(new CardService(), {
        customController: cardController,
    }),
    {
        customRoutes: [
            {
                handler: "create",
                method: "post",
                path: "/",
                middleware: [],
            },
            {
                handler: "getUserReviewCards",
                method: "get",
                path: "/user/:userId/review",
                middleware: [],
            },
            {
                handler: "getCardsByCategory",
                method: "get",
                path: "/user/:userId/category/:categoryName",
                middleware: [],
            },
            {
                handler: "addTagsByCard",
                method: "post",
                path: "/add-card-tag",
                middleware: [],
            },
            {
                handler: "removeTagsByCard",
                method: "delete",
                path: "/remove-card-tag/:tagId",
                middleware: [],
            },
            {
                handler: "getCardsByTags",
                method: "get",
                path: "/",
                middleware: [],
            },
            {
                handler: "getQuizz",
                method: "get",
                path: "/quizz",
                middleware: [],
            },
            {
                handler: "answerQuizz",
                method: "patch",
                path: "/:cardId/answer",
                middleware: [],
            },
        ],
        defaultRoutes: {
            getOne: {
                method: "get",
                path: "/card/:id",
                middleware: [],
                active: true,
            },
            update: {
                method: "put",
                path: "/card/:id",
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