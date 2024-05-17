import { Server } from "socket.io";
import { server } from "../../server.js";
import Jwt from "jsonwebtoken";
import { AppError } from "../utils/errorhandler.js";
import friendshipModel from "../user/models/friendships.model.js";
import { Op } from "sequelize";
const io = new Server(server);

const EVENTS = {
  // SUBSCRIBE_TO_CHAT: "subscribe-to-chats",
  // CLIENT_SENT_MESSAGE: "client-sent-message",
  MESSAGE_FROM_SERVER: "message-from-server",

  SUBSCRIBE_TO_CHAT: "1",
  CLIENT_SENT_MESSAGE: "2",
};

function getChatName(chatId) {
  return `chat-room-${chatId}`;
}

io.on("connection", (socket) => {
  try {
    let token = socket.handshake.headers.token;

    if (!token.startsWith("Bearer ")) {
      throw new AppError("Invalid token", 401);
    }
    token = token.split("Bearer ")[1];

    const payload = Jwt.verify(token, process.env.SECRET_KEY);
    socket.userId = payload.id;
    socket.send("connected successfully");
    console.log(`${socket.userId} connected`);
  } catch (error) {
    console.error({ error });
    socket.send("invalid token");
    socket.disconnect();
  }

  socket.on(EVENTS.SUBSCRIBE_TO_CHAT, async (chatIds) => {
    const friendShips = await friendshipModel.findAll({
      where: {
        id: chatIds,
        [Op.or]: [{ user1Id: socket.userId }, { user2Id: socket.userId }],
        status: "accepted",
      },
    });

    if (friendShips.length !== chatIds.length) {
      socket.send("un-authorized-to-join-chat");
      socket.disconnect();
    }

    for (const chatId of chatIds) {
      socket.join(getChatName(chatId));
    }
  });

  socket.on(EVENTS.CLIENT_SENT_MESSAGE, async (x) => {
    console.log({ x });

    const { chatId, message } = x;

    const friendShip = await friendshipModel.findOne({
      where: {
        id: chatId,
        [Op.or]: [{ user1Id: socket.userId }, { user2Id: socket.userId }],
        status: "accepted",
      },
    });

    if (!friendShip) {
      socket.send("un-authorized-to-send-message");
      socket.disconnect();
    }

    io.to(getChatName(chatId)).emit(EVENTS.MESSAGE_FROM_SERVER, {
      message,
      chatId,
      senderId: socket.userId,
    });
  });
});

// setInterval(() => {
//   io.emit("new-messages", "hello guys");
// }, 1000);
