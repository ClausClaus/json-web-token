/*
 * @Author: chenweishuang
 * @Date:   2018-07-14 09:34:33
 * @Last Modified by:   ClausClaus
 * @Last Modified time: 2018-07-14 13:33:06
 */
const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

// passport相关的一切将用于用户登录和令牌验证的功能。
const passport = require("passport");
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

// 定义假数据，通常是从数据库中获取
let users = [
    {
        id: 1,
        name: "jonathanmh",
        password: "%2yx4"
    },
    {
        id: 2,
        name: "test",
        password: "test"
    }
];

let jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "tasmanianDevil"
};
let strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
    console.log("payload received", jwt_payload);
    let user = users[_.findIndex(users, { id: jwt_payload.id })];
    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});

passport.use(strategy);

const app = express();
app.use(passport.initialize());

// 解析表单 application/x-www-from-urlencodeed
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(process.cwd() + "/public/index.html");
});
// 登录接口，返回token给登录用户
app.post("/login", (req, res) => {
    if (req.body.name && req.body.password) {
        var name = req.body.name;
        var password = req.body.password;
    }
    let user = users[_.findIndex(users, { name: name })];
    if (!user) {
        res.status(401).json({ message: "no such user found" });
    }
    if (user.password === req.body.password) {
        let payload = { id: user.id };
        let token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.json({ message: "OK", token });
    } else {
        res.status(401).json({ message: "password did not match" });
    }
});
// 如果能成功返回token，就证明该用户可以访问我的秘密路由
app.get(
    "/secret",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        res.json({ message: "Success! You can not see this without a token" });
    }
);

// 临时路由调试Bearer + token是否有效
app.get(
    "/secretDebug",
    function(req, res, next) {
        console.log(req.get("Authorization"));
        next();
    },
    function(req, res) {
        res.json("debugging");
    }
);

app.listen(3000, () => {
    console.log("Express running");
});
