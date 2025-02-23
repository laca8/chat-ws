import axios from "axios";
const API_URL = "/api/group";
interface Config {
  headers?: object;
}

const getGroups = async (config: Config): Promise<object> => {
  const response = await axios.get(`${API_URL}`, config);
  return await response.data;
};
const groupService = {
  getGroups,
};
export default groupService;
