import axios from "axios";
const API_URL = "/api/message";
interface Config {
  headers?: object;
}

interface MessageResponse {
  data: object;
}

const getPrivateMessages = async (
  username: string,
  config: Config
): Promise<object> => {
  const response: MessageResponse = await axios.get(
    `${API_URL}/private/${username}`,
    config
  );

  return await response.data;
};

const getGroupMessages = async (
  groupName: string,
  config: Config
): Promise<object> => {
  const response: MessageResponse = await axios.get(
    `${API_URL}/group/${groupName}`,
    config
  );

  return await response.data;
};
const messageService = {
  getGroupMessages,
  getPrivateMessages,
};
export default messageService;
