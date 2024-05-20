import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/errorhandler.js";
import friendshipModel from "../user/models/friendships.model.js";
import messageModel from "../messages/message.model.js";
import { Op } from "sequelize";

export const app = express();

export const server = createServer(app);

export const io = new Server(server);
const getChatName = (chatID) => {
  return `chat-room-${chatID}`;
};

io.on("connection", (socket) => {
  let token = socket.handshake.headers.token;

  try {
    if (!token) throw new AppError("UnAuthorized", 401);

    if (!token.startsWith("Bearer ")) throw new AppError("invalid Token", 400);

    token = token.split("Bearer ");

    const payload = jwt.verify(token[1], process.env.SECRET_KEY);

    if (payload.isRefresh) throw new AppError("invalid Token", 400);

    socket.userID = payload.id;
  } catch (e) {
    console.log(e);
    console.log("Disconnected");
    socket.disconnect();
  }

  socket.on("join-friend-chat", async () => {
    const friendships = await friendshipModel.findAll({
      where: {
        [Op.or]: [{ user1Id: socket.userID }, { user2Id: socket.userID }],
        status: "accepted",
      },
    });

    let friendShipIDs = friendships.map((friendship) =>
      getChatName(friendship.id)
    );

    socket.join(friendShipIDs);
  });

  socket.on("send-message", async ({ msg, chatID }) => {
    const friendships = await friendshipModel.findOne({
      where: {
        [Op.or]: [{ user1Id: socket.userID }, { user2Id: socket.userID }],
        status: "accepted",
        id: chatID,
      },
    });

    if (!friendships) return socket.disconnect();

    const receiverId =
      friendships.user1Id === socket.userID
        ? friendships.user2Id
        : friendships.user1Id;

    const msgData = await messageModel.create({
      senderId: socket.userID,
      receiverId: receiverId,
      content: msg,
    });

    if (!msgData) throw new AppError("can't send message", 400);

    io.to(getChatName(chatID)).emit("chat-message", msg);
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});
