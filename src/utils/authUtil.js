import bcrypt from 'bcrypt';

export const hashPassword = (password) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

export const comparePassword = async (plainPassword, encryptPassword) => {
  return await bcrypt.compare(plainPassword, encryptPassword);
};

export const generateAccessToken = async () => {
  //
};

export const generateRefreshToken = async () => {
  //
};
