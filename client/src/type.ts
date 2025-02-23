export type objectId = { _id: string };
export type user = {
  email: string;
  role: string;
};
export type conversation = {
  participant1: string;
  participant2: string;
};
export type message = {
  content: string;
  conversation: string;
  deleted: boolean;
};
