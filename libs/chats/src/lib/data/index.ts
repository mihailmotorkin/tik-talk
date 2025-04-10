import { Chat, LastMessageResponse, Message, SortedMessageByDate } from "./interfaces/chats.interface";
import { isErrorMessage } from "./interfaces/type-guards";
import { ChatWSRxjsService } from "./services/chat-ws-rxjs.service";
import { ChatsService } from "./services/chats.service";

export {
  ChatsService,
  ChatWSRxjsService,
  isErrorMessage
};

export type {
  Chat,
  Message,
  LastMessageResponse,
  SortedMessageByDate,

}
