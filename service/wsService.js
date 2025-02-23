const Message = require("../models/Message");
const Group = require("../models/Group");
const AppError = require("../utils/AppError");
const GroupMember = require("../models/GroupMember");

const sendPrivateMessage = async (data, clients) => {
  const { sender, to, message } = data;
  try {
    const receiver = clients.find((x) => x.username == to);
    const senderExist = clients.find((x) => x.username == sender);
    if (receiver) {
      // console.log(receiver);

      receiver?.ws?.send(
        JSON.stringify({
          type: "private",
          sender: sender,
          content: message,
          createdAt: new Date(),
        })
      );
    }
    if (senderExist) {
      senderExist?.ws?.send(
        JSON.stringify({
          type: "private",
          sender: sender,
          content: message,
          createdAt: new Date(),
        })
      );
    }
    await Message.create({
      sender,
      receiver: to,
      content: message,
    });
  } catch (error) {
    console.log(error);
    return new AppError(error.message, 500);
  }
};

const createNewGroup = async (data, clients) => {
  const { groupName } = data;
  try {
    console.log(data);

    const groupExist = await Group.findOne({ group_name: groupName });
    if (groupExist) {
      console.log(groupExist);

      return "group name is already exist";
    }
    await Group.create({ group_name: groupName });
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

const joinGroup = async (data, clients) => {
  const { joinGroup, username } = data;
  try {
    const joinExist = await GroupMember.findOne({
      $and: [{ group_name: joinGroup }, { username: username }],
    });
    const joinUser = clients.find((client) => client.username == username);
    if (joinUser) {
      joinUser?.ws?.send(
        JSON.stringify({
          type: "joinGroup",
          group_name: joinGroup,
          username,
        })
      );
    }

    if (joinExist) {
      console.log("user already in group");
    } else {
      const group = await GroupMember.create({
        group_name: joinGroup,
        username: username,
      });
    }
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

const sendGroupMessage = async (data, clients) => {
  const { sender, toGroup, message } = data;
  try {
    const senderExist = clients.find((x) => x.username == sender);
    if (senderExist) {
      senderExist.ws.send(
        JSON.stringify({
          type: "group",
          sender: sender,
          content: message,
          createdAt: new Date(),
          toGroup: toGroup,
        })
      );
    }
    const members = await GroupMember.find({ group_name: toGroup });
    members.forEach((member) => {
      const receiver = clients.find(
        (client) => client.username == member.username
      );
      if (receiver) {
        receiver?.ws?.send(
          JSON.stringify({
            type: "group",
            sender: sender,
            content: message,
            createdAt: new Date(),
            toGroup: toGroup,
          })
        );
      }
    });
    await Message.create({
      sender,
      group_name: toGroup,
      content: message,
    });
  } catch (error) {
    console.log(error);
    return new AppError(error.message, 500);
  }
};

module.exports = {
  sendPrivateMessage,
  createNewGroup,
  joinGroup,
  sendGroupMessage,
};
