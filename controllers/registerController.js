const User = require("../model/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({
      status: 400,
      message: "Kullanıcı adı ve şifre zorunludur.",
    });

  // check for duplicate usernames in the db
  const duplicate = await User.findOne({ username: username }).exec();
  if (duplicate) return res.sendStatus(409); //Conflict

  try {
    const hashedPwd = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: username,
      password: hashedPwd,
    });

    res.status(200).json({
      status: 200,
      data: user,
      message: "Kullanıcı başarı ile oluşturuldu.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
