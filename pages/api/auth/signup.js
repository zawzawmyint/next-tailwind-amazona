import User from "@/models/User";
import db from "@/utils/db";
import bcryptjs from "bcryptjs";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }

  const { name, email, password } = req.body;
  if (
    !name ||
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 5
  ) {
    res.status(422).json({ message: "Validation error" });

    return;
  }

  await db.connect();
  const existingUser = await User.findOne({ email: email });
  console.log(existingUser);

  if (existingUser) {
    res.status(422).json({ message: "User exists already" });
    await db.disconnect();
    return;
  }

  const newUser = new User({
    name,
    email,
    password: bcryptjs.hashSync(password),
    isAdmin: false,
  });

  const user = await newUser.save();
  await db.disconnect();
  res.status(201).send({
    message: "Created user successfully",
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
}

export default handler;
