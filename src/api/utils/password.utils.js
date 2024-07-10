const bcrypt = require("bcrypt");

const comaparePasswords = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};


module.exports = {
    comaparePasswords,
    hashPassword,
};
