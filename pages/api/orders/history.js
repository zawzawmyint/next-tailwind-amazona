const { default: Order } = require("@/models/Order");
const { default: db } = require("@/utils/db");
const { getSession } = require("next-auth/react");

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) res.status(401).send({ message: "signin required" });

  const { user } = session;

  await db.connect();
  const orders = await Order.find({ user: user._id });
  await db.disconnect();
  res.send(orders);
};

export default handler;
