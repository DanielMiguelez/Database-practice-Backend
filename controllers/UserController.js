const {User, Token} = require("../models/index.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config/config.json")["development"];

const UserController = {
    async create(req, res, next) {
      try {
        req.body.role = "user";
        const password = await bcrypt.hash(
          req.body.password ? req.body.password : "",
          10
        );
        const user = await User.create({ ...req.body, password });
        res.status(201).send({ msg: "user succesfully created", user });
      } catch (error) {
        console.error(error);
        next(error);
      }
    },
    login(req, res) {
        User.findOne({
          where: {
            email: req.body.email,
          },
        }).then((user) => {
          if (!user) {
            return res
              .status(400)
              .send({ message: "Usuario o contraseña incorrectos" });
          }
    
          const isMatch = bcrypt.compareSync(req.body.password, user.password);
    
          if (!isMatch) {
            return res
              .status(400)
              .send({ message: "Usuario o contraseña incorrectos" });
          }
    
          const token = jwt.sign({ id: user.id }, jwt_secret);
          Token.create({ token, UserId: user.id });
    
          res.send({ message: "Welcome " + user.name, user, token });
        });
      },

};

module.exports = UserController;
