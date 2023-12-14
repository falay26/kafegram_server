const User = require("../model/User");
const bcrypt = require("bcrypt");

const createCafe = async (req, res) => {
  const { username } = req.body;
  if (!username)
    return res.status(400).json({
      status: 400,
      message: "Kullanıcı adı zorunludur.",
    });

  // check for duplicate usernames in the db
  const duplicate = await User.findOne({ username: username }).exec();
  if (duplicate) return res.sendStatus(409); //Conflict

  try {
    const hashedPwd = await bcrypt.hash("123456", 10);

    const user = await User.create({
      username: username,
      roles: {
        Kafe: 5005,
      },
      password: hashedPwd,
    });

    res.status(200).json({
      status: 200,
      data: user,
      message: "Kafe başarı ile oluşturuldu.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createCafe };
