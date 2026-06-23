export interface ChatParticipant {
  _id: string;
  fullName: string;
  role: string;
  profilePhoto?: string;
}

export interface ChatRoom {
  _id: string;
  type: 'global' | 'personal';
  participants: ChatParticipant[];
  createdBy: string;
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  _id: string;
  roomId: string;
  senderId: ChatParticipant;
  message: string;
  attachment?: {
    url: string;
    type: 'image' | 'pdf' | 'doc';
    name: string;
  };
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatRoomsApiResponse {
  statusCode: number;
  message: string;
  data: {
    room_data: ChatRoom[];
  };
}

export interface ChatMessagesApiResponse {
  statusCode: number;
  message: string;
  data: {
    message_data: ChatMessage[];
    totalData: number;
  };
}

export interface SendMessagePayload {
  roomId?: string; // Optional for global room message
  message: string;
  attachment?: {
    url: string;
    type: 'image' | 'pdf' | 'doc';
    name: string;
  };
}

export interface CreateRoomPayload {
  recipientId: string;
}
