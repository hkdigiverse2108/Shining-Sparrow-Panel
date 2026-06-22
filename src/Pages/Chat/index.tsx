import { useState, useEffect, useRef, useMemo, type FC } from 'react';
import { Avatar, Input, Button, Spin, Empty, Badge, Tag, Modal, Tooltip } from 'antd';
import { SendOutlined, MessageOutlined, UserOutlined, PlusOutlined, SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { io, Socket } from 'socket.io-client';
import { Queries } from '@/Api/Queries';
import { Mutations } from '@/Api/Mutations';
import { useAppSelector } from '@/Store/hooks';
import { getToken } from '@/Utils';
import { BREADCRUMBS } from '@/Data';
import { CommonBreadcrumbs, CommonPageWrapper } from '@/Components';
import { showNotification } from '@/Attribute';
import type { ChatRoom, ChatMessage } from '@/Types/Chat';

const ChatPage: FC = () => {
  const currentUser = useAppSelector((state) => state.auth.user);
  
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [roomsList, setRoomsList] = useState<ChatRoom[]>([]);
  const [messagesList, setMessagesList] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  
  // Search & Modal States
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Manage layout container height and scrolling for chat page only
  useEffect(() => {
    const contentEl = document.querySelector('.ant-layout-content');
    if (contentEl) {
      contentEl.classList.add('chat-page-layout-content');
    }
    return () => {
      if (contentEl) {
        contentEl.classList.remove('chat-page-layout-content');
      }
    };
  }, []);

  // 1. Fetch rooms list
  const { data: roomsData, isLoading: isLoadingRooms, refetch: refetchRooms } = Queries.useGetRooms();

  // 2. Fetch users list (for Start Chat Modal)
  const { data: usersData, isLoading: isLoadingUsers } = Queries.useGetUser({
    page: 1,
    limit: 100
  });

  // Initialize rooms state when data loads
  useEffect(() => {
    if (roomsData?.data?.room_data) {
      setRoomsList(roomsData.data.room_data);
    }
  }, [roomsData]);

  // 3. Fetch messages when room changes
  const { data: messagesData, isLoading: isLoadingMessages } = Queries.useGetMessages(
    selectedRoom?._id || ''
  );

  // Initialize messages list state when messages data changes
  useEffect(() => {
    if (selectedRoom && messagesData?.data?.message_data) {
      setMessagesList(messagesData.data.message_data);
      setTimeout(scrollToBottom, 50);
    } else if (!selectedRoom) {
      setMessagesList([]);
    }
  }, [messagesData, selectedRoom]);

  // 4. Setup WebSocket connection
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const socketUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5555';
    const socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to chat server');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from chat server');
    });

    // Real-time message listener
    socket.on('new_message', (data: { roomId: string; message: ChatMessage }) => {
      const { roomId, message } = data;
      
      // If the message belongs to the active room, append to messages list
      if (selectedRoom && selectedRoom._id === roomId) {
        setMessagesList((prev) => {
          if (prev.some((m) => m._id === message._id)) return prev;
          return [...prev, message];
        });
        setTimeout(scrollToBottom, 50);
      }

      // Update room list preview reactively
      setRoomsList((prev) => {
        return prev
          .map((room) => {
            if (room._id === roomId) {
              return {
                ...room,
                lastMessage: message.message,
                lastMessageAt: message.createdAt,
              };
            }
            return room;
          })
          .sort((a, b) => new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime());
      });
    });

    // Real-time room created listener
    socket.on('room_created', () => {
      refetchRooms();
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [selectedRoom, refetchRooms]);

  // Scroll messages wrapper to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 5. Send Message Mutation
  const sendMessageMutation = Mutations.useSendMessage();

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const payload = {
      message: inputText.trim(),
      roomId: selectedRoom?.type === 'global' ? undefined : selectedRoom?._id,
    };

    sendMessageMutation.mutate(payload, {
      onSuccess: () => {
        setInputText('');
      }
    });
  };

  // Helper: Format message timestamp
  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Helper: Format relative day header
  const formatDateHeader = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Helper: Get other participant details (for personal chat)
  const getOtherParticipant = (room: ChatRoom) => {
    if (room.type === 'global') return null;
    return room.participants.find((p) => p._id !== currentUser?._id) || room.participants[0] || null;
  };

  // Helper: Get photo url or base64
  const getProfilePhotoUrl = (photo?: string | null) => {
    if (!photo) return undefined;
    if (photo.startsWith('http') || photo.startsWith('data:')) {
      return photo;
    }
    return `${import.meta.env.VITE_API_BASE_URL}/images/${photo}`;
  };

  // Helper: Find existing room for a specific user ID
  const findRoomForUser = (userId: string) => {
    return roomsList.find((room) => {
      if (room.type === 'global') return false;
      return room.participants.some((p) => p._id === userId);
    });
  };

  // Filter conversations list (left side) based on search input
  const filteredPersonalRooms = useMemo(() => {
    const personalRooms = roomsList.filter((room) => room.type === 'personal');
    if (!chatSearchQuery.trim()) return personalRooms;
    const q = chatSearchQuery.toLowerCase();
    return personalRooms.filter((room) => {
      const otherUser = getOtherParticipant(room);
      return otherUser?.fullName?.toLowerCase().includes(q);
    });
  }, [roomsList, chatSearchQuery]);

  // Global room (Community)
  const globalRoom = useMemo(() => {
    return roomsList.find((room) => room.type === 'global') || null;
  }, [roomsList]);

  // Filter users inside Start Chat Modal
  const filteredUsers = useMemo(() => {
    const allUsers = usersData?.data?.user_data || [];
    // Filter out current admin user
    const otherUsers = allUsers.filter((u) => u._id !== currentUser?._id);

    if (!userSearchQuery.trim()) return otherUsers;
    const q = userSearchQuery.toLowerCase();
    return otherUsers.filter(
      (u) =>
        u.fullName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
    );
  }, [usersData, userSearchQuery, currentUser]);

  // Handle selecting a user from the modal
  const handleSelectUser = (userItem: any) => {
    const existingRoom = findRoomForUser(userItem._id);
    if (existingRoom) {
      setSelectedRoom(existingRoom);
      setIsModalOpen(false);
      setUserSearchQuery('');
    } else {
      showNotification(
        'warning',
        'No chat session exists with this user. Chats must be initiated by regular users.'
      );
    }
  };

  return (
    <>
      {/* <CommonBreadcrumbs title="Chat Support" breadcrumbs={BREADCRUMBS.CHAT || []} /> */}
      <CommonPageWrapper noPadding className="h-full ">
        <div className={`chat-container ${selectedRoom ? 'has-selected-room' : ''}`}>
          {/* Left Sidebar */}
          <div className="chat-sidebar">
            <div className="chat-sidebar-header">
              <div className="chat-sidebar-top">
                <h3 className="chat-sidebar-title">Conversations</h3>
                <div className="flex items-center gap-2">
                  <Tooltip title="Start Chat / Search User">
                    <Button
                      type="text"
                      icon={<PlusOutlined />}
                      shape="circle"
                      onClick={() => setIsModalOpen(true)}
                    />
                  </Tooltip>
                  <Badge
                    status={isConnected ? 'success' : 'error'}
                    title={isConnected ? 'Server Connected' : 'Disconnected'}
                  />
                </div>
              </div>
              <div className="chat-search-wrapper">
                <Input
                  placeholder="Search chats..."
                  prefix={<SearchOutlined style={{ color: 'var(--text-muted)' }} />}
                  value={chatSearchQuery}
                  onChange={(e) => setChatSearchQuery(e.target.value)}
                  className="chat-search-input"
                  allowClear
                />
              </div>
            </div>

            <div className="chat-rooms-container">
              {/* Sticky Community Section */}
              {globalRoom && (
                <div className="chat-community-section">
                  <div className="chat-section-header">Community</div>
                  <div
                    className={`chat-room-item ${selectedRoom?._id === globalRoom._id ? 'active' : ''}`}
                    onClick={() => setSelectedRoom(globalRoom)}
                  >
                    <div className="chat-room-avatar">
                      <Avatar
                        size={40}
                        style={{ backgroundColor: 'var(--primary)' }}
                        icon={<MessageOutlined />}
                      />
                    </div>
                    <div className="chat-room-info">
                      <div className="chat-room-meta">
                        <span className="chat-room-name">Global Broadcast Channel</span>
                        {globalRoom.lastMessageAt && (
                          <span className="chat-room-time">
                            {formatTime(globalRoom.lastMessageAt)}
                          </span>
                        )}
                      </div>
                      <p className="chat-room-last-msg">
                        {globalRoom.lastMessage || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Personal Chats Section */}
              <div className="chat-section-header">Personal Chats</div>
              <div style={{ flex: 1 }}>
                {isLoadingRooms ? (
                  <div className="chat-loading">
                    <Spin size="small" />
                  </div>
                ) : filteredPersonalRooms.length > 0 ? (
                  filteredPersonalRooms.map((room) => {
                    const otherUser = getOtherParticipant(room);
                    const isActive = selectedRoom?._id === room._id;
                    
                    return (
                      <div
                        key={room._id}
                        className={`chat-room-item ${isActive ? 'active' : ''}`}
                        onClick={() => setSelectedRoom(room)}
                      >
                        <div className="chat-room-avatar">
                          <Avatar
                            size={40}
                            icon={<UserOutlined />}
                            src={getProfilePhotoUrl(otherUser?.profilePhoto)}
                          />
                        </div>
                        <div className="chat-room-info">
                          <div className="chat-room-meta">
                            <span className="chat-room-name">
                              {otherUser?.fullName || 'Chat User'}
                            </span>
                            {room.lastMessageAt && (
                              <span className="chat-room-time">
                                {formatTime(room.lastMessageAt)}
                              </span>
                            )}
                          </div>
                          <p className="chat-room-last-msg">
                            {room.lastMessage || 'No messages yet'}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-xs text-[var(--text-muted)]">
                    No personal chats found.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Pane: Active Chat Window */}
          <div className="chat-main">
            {selectedRoom ? (
              <>
                {/* Header */}
                <div className="chat-header">
                  <div className="chat-header-user">
                    <Button
                      type="text"
                      icon={<ArrowLeftOutlined />}
                      className="chat-mobile-back-btn"
                      onClick={() => setSelectedRoom(null)}
                    />
                    <Avatar
                      size={42}
                      style={{ backgroundColor: selectedRoom.type === 'global' ? 'var(--primary)' : undefined }}
                      icon={selectedRoom.type === 'global' ? <MessageOutlined /> : <UserOutlined />}
                      src={selectedRoom.type !== 'global' ? getProfilePhotoUrl(getOtherParticipant(selectedRoom)?.profilePhoto) : undefined}
                    />
                    <div className="chat-header-details">
                      <h4 className="chat-header-name">
                        {selectedRoom.type === 'global'
                          ? 'Global Broadcast Channel'
                          : getOtherParticipant(selectedRoom)?.fullName || 'Chat User'}
                      </h4>
                      <span className="chat-header-status">
                        {selectedRoom.type === 'global' ? (
                          <Tag color="orange">Broadcast to all users</Tag>
                        ) : (
                          <Tag color="blue">{getOtherParticipant(selectedRoom)?.role || 'User'}</Tag>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="chat-messages">
                  {isLoadingMessages ? (
                    <div className="chat-loading">
                      <Spin />
                    </div>
                  ) : messagesList.length > 0 ? (
                    (() => {
                      let lastDate = '';
                      return messagesList.map((msg, index) => {
                        const msgDate = new Date(msg.createdAt).toDateString();
                        const showDateSeparator = msgDate !== lastDate;
                        lastDate = msgDate;

                        const isSentByMe = msg.senderId?._id === currentUser?._id;
                        
                        return (
                          <div key={msg._id || index} style={{ display: 'flex', flexDirection: 'column' }}>
                            {showDateSeparator && (
                              <div className="chat-message-date-separator">
                                <span className="chat-message-date-text">
                                  {formatDateHeader(msg.createdAt)}
                                </span>
                              </div>
                            )}
                            <div className={`chat-message ${isSentByMe ? 'sent' : 'received'}`}>
                              <Avatar
                                size={32}
                                icon={<UserOutlined />}
                                src={getProfilePhotoUrl(msg.senderId?.profilePhoto)}
                                style={{ flexShrink: 0 }}
                              />
                              <div className="chat-message-content">
                                {!isSentByMe && (
                                  <span className="chat-message-sender">
                                    {msg.senderId?.fullName || 'User'}
                                  </span>
                                )}
                                <div className="chat-message-bubble">
                                  {msg.message}
                                  <div className="chat-message-time" style={{ textAlign: isSentByMe ? 'right' : 'left' }}>
                                    {formatTime(msg.createdAt)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()
                  ) : (
                    <div className="chat-empty-state">
                      <Empty description="No messages in this chat room yet." />
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Footer Composer */}
                <div className="chat-footer">
                  <div className="chat-composer-wrapper">
                    <Input
                      placeholder="Type a message..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onPressEnter={(e) => {
                        if (!e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="chat-composer-input"
                      disabled={sendMessageMutation.isPending}
                    />
                    <Button
                      type="primary"
                      icon={<SendOutlined />}
                      onClick={handleSendMessage}
                      loading={sendMessageMutation.isPending}
                      className="chat-send-btn"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="chat-empty-state">
                <MessageOutlined className="chat-empty-icon" />
                <h3>No Chat Selected</h3>
                <p>Select a conversation from the left menu to start messaging.</p>
              </div>
            )}
          </div>
        </div>
      </CommonPageWrapper>

      {/* Start Chat Modal */}
      <Modal
        title="Start Chat with User"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setUserSearchQuery('');
        }}
        footer={null}
        width={500}
      >
        <div style={{ marginBottom: '16px' }}>
          <Input
            placeholder="Search users by name or email..."
            prefix={<SearchOutlined style={{ color: 'var(--text-muted)' }} />}
            value={userSearchQuery}
            onChange={(e) => setUserSearchQuery(e.target.value)}
            allowClear
          />
        </div>

        <div className="chat-modal-user-list">
          {isLoadingUsers ? (
            <div className="text-center p-4">
              <Spin />
            </div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((userItem: any) => {
              const hasRoom = !!findRoomForUser(userItem._id);
              
              return (
                <div key={userItem._id} className="chat-modal-user-item">
                  <div className="chat-modal-user-info">
                    <Avatar
                      icon={<UserOutlined />}
                      src={getProfilePhotoUrl(userItem.profilePhoto)}
                    />
                    <div className="chat-modal-user-details">
                      <h5 className="chat-modal-user-name">{userItem.fullName || 'User'}</h5>
                      <span className="chat-modal-user-email">{userItem.email}</span>
                    </div>
                  </div>
                  <div className="chat-modal-user-action">
                    <Button
                      type={hasRoom ? 'primary' : 'default'}
                      onClick={() => handleSelectUser(userItem)}
                    >
                      {hasRoom ? 'Open Chat' : 'Start Chat'}
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center p-4 text-xs text-[var(--text-muted)]">No users found.</div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ChatPage;
