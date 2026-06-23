import { useState, useEffect, useRef, useMemo, useCallback, type FC, type ChangeEvent } from 'react';
import { Avatar, Input, Button, Spin, Empty, Badge, Tag } from 'antd';
import { SendOutlined, MessageOutlined, UserOutlined, SearchOutlined, ArrowLeftOutlined, PaperClipOutlined, FileOutlined, FilePdfOutlined, CloseOutlined, DownloadOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { Queries } from '@/Api/Queries';
import { Mutations } from '@/Api/Mutations';
import { useAppSelector } from '@/Store/hooks';
import { getToken } from '@/Utils';
import { CommonPageWrapper } from '@/Components';
import { showNotification } from '@/Attribute';
import { Post } from '@/Api/Methods';
import type { ChatRoom, ChatMessage } from '@/Types/Chat';
import { useQueryClient } from '@tanstack/react-query';

const ChatPage: FC = () => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const location = useLocation();
  const navigate = useNavigate();
  
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [roomsList, setRoomsList] = useState<ChatRoom[]>([]);
  const [messagesList, setMessagesList] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Search State
  const [chatSearchQuery, setChatSearchQuery] = useState('');

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const processedUserChatRef = useRef<string | null>(null);

  const queryClient = useQueryClient();

  const selectedRoomRef = useRef<ChatRoom | null>(null);

  useEffect(() => {
    selectedRoomRef.current = selectedRoom;
  }, [selectedRoom]);

  // Mutations
  const createRoomMutation = Mutations.useCreateRoom();

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

  const refetchRoomsRef = useRef(refetchRooms);
  useEffect(() => {
    refetchRoomsRef.current = refetchRooms;
  }, [refetchRooms]);

  // Initialize rooms state when data loads
  useEffect(() => {
    if (roomsData?.data?.room_data) {
      Promise.resolve().then(() => {
        setRoomsList(roomsData.data.room_data);
      });
    }
  }, [roomsData]);

  // Handle Start Chat redirection from User Management
  useEffect(() => {
    const targetUserId = location.state?.userId;
    if (!targetUserId) {
      processedUserChatRef.current = null;
      return;
    }

    if (roomsList.length > 0 && processedUserChatRef.current !== targetUserId) {
      processedUserChatRef.current = targetUserId;
      
      const existingRoom = roomsList.find((room) => {
        if (room.type === 'global') return false;
        return room.participants.some((p) => p._id === targetUserId);
      });

      if (existingRoom) {
        Promise.resolve().then(() => {
          setSelectedRoom(existingRoom);
        });
      } else {
        // Create new room automatically
        createRoomMutation.mutate(
          { recipientId: targetUserId },
          {
            onSuccess: (resData: any) => {
              if (resData?.data?.room) {
                setSelectedRoom(resData.data.room);
              }
              refetchRooms();
            },
            onError: () => {
              showNotification('error', 'Failed to start chat with this user.');
            }
          }
        );
      }

      // Clear route state to prevent repeating on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [roomsList, location.state, navigate, location.pathname, createRoomMutation, refetchRooms]);

  // 3. Fetch messages when room changes
  const { data: messagesData, isLoading: isLoadingMessages } = Queries.useGetMessages(
    selectedRoom?._id || ''
  );

  // Scroll messages wrapper to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initialize messages list state when messages data changes
  useEffect(() => {
    if (selectedRoom && messagesData?.data?.message_data) {
      Promise.resolve().then(() => {
        setMessagesList(messagesData.data.message_data);
        setTimeout(scrollToBottom, 50);
      });
    } else if (!selectedRoom) {
      Promise.resolve().then(() => {
        setMessagesList([]);
      });
    }
  }, [messagesData, selectedRoom]);

  // 4. Setup WebSocket connection
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    let socketUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5555';
    // Dynamically replace localhost/127.0.0.1 with current hostname for local network support
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      socketUrl = socketUrl.replace('localhost', window.location.hostname).replace('127.0.0.1', window.location.hostname);
    }

    const socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
      setIsConnected(false);
    });

    // Real-time message listener
    socket.on('new_message', (data: { roomId: string; message: ChatMessage }) => {
      const { roomId, message } = data;
      
      // Invalidate queries to trigger React Query refetches
      queryClient.invalidateQueries({ queryKey: ['chat-rooms'] });
      queryClient.invalidateQueries({ queryKey: ['chat-messages', roomId] });

      // If the message belongs to the active room, append to messages list
      if (selectedRoomRef.current && selectedRoomRef.current._id === roomId) {
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
              const preview = message.message || (message.attachment ? `[${message.attachment.name}]` : '');
              return {
                ...room,
                lastMessage: preview,
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
      refetchRoomsRef.current();
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);


  // 5. Send Message Mutation
  const sendMessageMutation = Mutations.useSendMessage();

  const handleSendMessage = async () => {
    if (!inputText.trim() && !selectedFile) return;

    const msg = inputText.trim();
    const file = selectedFile;
    setInputText('');
    setSelectedFile(null);

    try {
      let attachmentPayload: ChatMessage['attachment'] | undefined;

      if (file) {
        setUploading(true);
        let fieldName = 'doc';
        let attachType: 'image' | 'pdf' | 'doc' = 'doc';

        if (file.type.startsWith('image/')) {
          fieldName = 'images';
          attachType = 'image';
        } else if (file.type === 'application/pdf') {
          fieldName = 'pdf';
          attachType = 'pdf';
        }

        const formData = new FormData();
        formData.append(fieldName, file);
        if (fieldName === 'images') {
          formData.append('category', 'chat');
        }

        const uploadResult: any = await Post('/upload', formData, true, false);
        const uploaded = uploadResult?.data;
        let url = '';
        if (attachType === 'image') {
          url = uploaded?.images?.[0] || '';
        } else if (attachType === 'pdf') {
          url = uploaded?.pdfs?.[0] || '';
        } else {
          url = uploaded?.docs?.[0] || '';
        }

        if (!url) {
          console.error('Upload response missing URL:', uploadResult);
          throw new Error('Upload returned no URL');
        }
        attachmentPayload = { url, type: attachType, name: file.name };
      }

      const payload: any = {
        message: msg || '',
        roomId: selectedRoom?.type === 'global' ? undefined : selectedRoom?._id,
      };
      if (attachmentPayload) payload.attachment = attachmentPayload;

      sendMessageMutation.mutate(payload, {
        onSuccess: () => {
          setInputText('');
          queryClient.invalidateQueries({ queryKey: ['chat-rooms'] });
          if (selectedRoom?._id) {
            queryClient.invalidateQueries({ queryKey: ['chat-messages', selectedRoom._id] });
          }
        },
        onError: (err: any) => {
          console.error('Send message failed:', err);
          setInputText(msg);
          setSelectedFile(file);
          showNotification('error', err?.message || 'Failed to send message');
        },
      });
    } catch (err: any) {
      console.error('File upload error:', err);
      setInputText(msg);
      setSelectedFile(file);
      showNotification('error', err?.message || 'File upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClearSelectedFile = () => {
    setSelectedFile(null);
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
  const getOtherParticipant = useCallback((room: ChatRoom) => {
    if (room.type === 'global') return null;
    return room.participants.find((p) => p._id !== currentUser?._id) || room.participants[0] || null;
  }, [currentUser?._id]);

  // Helper: Get photo url or base64
  const getProfilePhotoUrl = (photo?: string | null) => {
    if (!photo) return undefined;
    if (photo.startsWith('http') || photo.startsWith('data:')) {
      return photo;
    }
    return `${import.meta.env.VITE_API_BASE_URL}/images/${photo}`;
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
  }, [roomsList, chatSearchQuery, getOtherParticipant]);

  // Global room (Community)
  const globalRoom = useMemo(() => {
    return roomsList.find((room) => room.type === 'global') || null;
  }, [roomsList]);



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
                                  {msg.message && <div className={msg.attachment ? 'mb-2' : ''}>{msg.message}</div>}
                                  {msg.attachment && (
                                    <div className={msg.message ? 'mt-2' : ''}>
                                      {msg.attachment.type === 'image' ? (
                                        <a href={msg.attachment.url} target="_blank" rel="noopener noreferrer">
                                          <img
                                            src={msg.attachment.url}
                                            alt={msg.attachment.name}
                                            style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, objectFit: 'cover', cursor: 'pointer' }}
                                          />
                                        </a>
                                      ) : (
                                        <a
                                          href={msg.attachment.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{
                                            display: 'flex', alignItems: 'center', gap: 8,
                                            padding: '6px 10px', borderRadius: 8,
                                            background: isSentByMe ? 'rgba(255,255,255,0.15)' : 'var(--bg-tertiary, #f5f5f5)',
                                            color: 'inherit', fontSize: 12, textDecoration: 'none',
                                          }}
                                        >
                                          {msg.attachment.type === 'pdf' ? <FilePdfOutlined /> : <FileOutlined />}
                                          <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {msg.attachment.name}
                                          </span>
                                          <DownloadOutlined />
                                        </a>
                                      )}
                                    </div>
                                  )}
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
                  {/* File Preview */}
                  {selectedFile && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '6px 12px', margin: '0 12px 8px',
                      background: 'var(--bg-secondary, #fafafa)',
                      border: '1px solid var(--border-color, #e8e8e8)',
                      borderRadius: 8,
                    }}>
                      {selectedFile.type.startsWith('image/') ? (
                        <img
                          src={URL.createObjectURL(selectedFile)}
                          alt="preview"
                          style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{
                          width: 36, height: 36, borderRadius: 6,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'var(--primary-light, rgba(24,144,255,0.1))',
                        }}>
                          {selectedFile.type === 'application/pdf' ? <FilePdfOutlined /> : <FileOutlined />}
                        </div>
                      )}
                      <span style={{ flex: 1, fontSize: 12, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {selectedFile.name}
                      </span>
                      <Button
                        type="text"
                        size="small"
                        icon={<CloseOutlined />}
                        onClick={handleClearSelectedFile}
                        disabled={uploading}
                        style={{ color: 'var(--text-muted, #999)' }}
                      />
                    </div>
                  )}

                  <div className="chat-composer-wrapper">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf,.doc,.docx"
                      style={{ display: 'none' }}
                      onChange={handleFileSelect}
                    />
                    <Button
                      type="text"
                      icon={<PaperClipOutlined />}
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      style={{ border: 'none', boxShadow: 'none', color: 'var(--text-muted, #999)' }}
                    />
                    <Input
                      placeholder={selectedFile ? 'Add a caption...' : 'Type a message...'}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onPressEnter={(e) => {
                        if (!e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="chat-composer-input"
                      disabled={sendMessageMutation.isPending || uploading}
                    />
                    <Button
                      type="primary"
                      icon={uploading ? undefined : <SendOutlined />}
                      onClick={handleSendMessage}
                      loading={uploading || sendMessageMutation.isPending}
                      disabled={(!inputText.trim() && !selectedFile) || uploading}
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
    </>
  );
};

export default ChatPage;
