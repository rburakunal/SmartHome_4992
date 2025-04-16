const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../src/models/User"); // ← Doğru path burada

async function createUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const username = "admin";
    const password = "admin123";
    const role = "admin";

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      passwordHash,
      role,
    });

    await newUser.save();
    console.log("✅ Kullanıcı başarıyla oluşturuldu");
    process.exit(0);
  } catch (error) {
    console.error("❌ Kullanıcı oluşturulamadı:", error);
    process.exit(1);
  }
}

createUser();
