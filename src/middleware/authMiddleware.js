import jwt from "jsonwebtoken";
import { MongoAWSError } from "mongodb";
import { UserService } from "../services/user-service.js";

export const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = authorization ? authorization.split(" ")[1] : undefined;
  if (!token) {
    return res.status(401).json({ messagem: "Não autorizado,faça o login." });
  }

  const secretkey = process.env.SECRET_KEY;
  jwt.verify(
    token,
    secretkey,
    { ignoreExpiration: false },
    async (err, decodedToken) => {
      if (err) {
        return res
          .status(401)
          .json({ messagem: "Acoonteceu um erro ao logar no sistema." });
      }
      const isValidToken = decodedToken && decodedToken.user;
      if (!isValidToken) {
        return res
          .status(401)
          .json({ messagem: "Acoonteceu um erro ao logar no sistema." });
      }

      const userService = new UserService();
      const user = await userService.findByEmail(decodedToken.user.email);
      if (user) {
        return next();
      }
    }
  );
};
