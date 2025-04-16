const bcrypt = require('bcryptjs');

const testPassword = async () => {
  const plainPassword = 'admin123';
  const hashedPassword = '$2b$10$eDpJXt1N2MYDPdQeY7KHheDwCZXrqYiVbO0BJK27jBd3EJ5sl/.uy';

  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('Şifre doğru mu? →', isMatch);
  } catch (err) {
    console.error('Hata:', err);
  }
};

testPassword();
