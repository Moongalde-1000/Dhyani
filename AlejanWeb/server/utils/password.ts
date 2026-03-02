// Generate a random 8-digit alphanumeric password
export const generateRandomPassword = (): string => {
  const length = 8;
  const charset = '0123456789';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
};

// Hash password using bcrypt
export const hashPassword = async (password: string): Promise<string> => {
  const bcrypt = await import('bcrypt');
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};
