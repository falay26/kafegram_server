const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const cookies = req.cookies;

  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({
      status: 400,
      message: "Kullanıcı adı ve şifre girilmesi zorunludur.",
    });

  const foundUser = await User.findOne({ username: username }).exec();
  if (!foundUser)
    return res.status(401).json({
      status: 401,
      message: "Kullanıcı bulunamadı.",
    });
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles).filter(Boolean);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    const newRefreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    let newRefreshTokenArray = !cookies?.jwt
      ? foundUser.refreshToken
      : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

    if (cookies?.jwt) {
      const refreshToken = cookies.jwt;
      const foundToken = await User.findOne({ refreshToken }).exec();

      if (!foundToken) {
        newRefreshTokenArray = [];
      }

      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
    }

    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    const result = await foundUser.save();

    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    //TODO: send successful user message via a helper..
    res.status(200).json({
      status: 200,
      message: "Giriş yapma işlemi başarılı!",
      user: {
        roles,
        accessToken,
      },
    });
  } else {
    res.status(401).json({
      status: 401,
      message: "Şifre hatalı!",
    });
  }
};

module.exports = { handleLogin };
