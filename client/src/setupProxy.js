const proxy = require("http-proxy-middleware");
module.exports = function (app) {
    app.use(proxy("/api/auth", { target: "http://localhost:5000" }));
    app.use(proxy("/api/users", { target: "http://localhost:5000" }));
    app.use(proxy("/api/notifications", { target: "http://localhost:5001" }));
};
