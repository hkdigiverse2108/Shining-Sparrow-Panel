import { useEffect, useRef, type FC } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Layout, ConfigProvider, theme } from 'antd'; 
import Sidebar from './Sidebar';
import DashboardHeader from './Header';
import { useAppSelector, useAppDispatch } from '@/Store/hooks'; 
import { setToggleSidebar, setToggleTheme, addUnreadRoom } from '@/Store';
import { motion, AnimatePresence } from 'motion/react';
import { io } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { getToken } from '@/Utils';
import { showNotification } from '@/Attribute';

const DashboardLayout: FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { isToggleTheme, isExpanded, activeRoomId } = useAppSelector((state) => state.layout);
  const currentUser = useAppSelector((store) => store.auth.user);
  const queryClient = useQueryClient();
  const isDark = isToggleTheme === "dark";

  const activeRoomIdRef = useRef(activeRoomId);
  useEffect(() => {
    activeRoomIdRef.current = activeRoomId;
  }, [activeRoomId]);

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

    socket.on('new_message', (data: { roomId: string; message: any }) => {
      // Invalidate rooms query to trigger sidebar and header badge updates
      queryClient.invalidateQueries({ queryKey: ['chat-rooms'] });
      queryClient.invalidateQueries({ queryKey: ['chat-messages', data.roomId] });

      const sender = data.message.senderId;
      const senderId = typeof sender === 'object' ? sender?._id : sender;

      // If the message is from someone else, and is not the active room
      if (senderId && currentUser?._id && senderId !== currentUser._id && data.roomId !== activeRoomIdRef.current) {
        // Dispatch to Redux store to mark as unread instantly
        dispatch(addUnreadRoom(data.roomId));

        // Programmatically generate a chime sound using Web Audio API
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc1 = audioCtx.createOscillator();
          const gain1 = audioCtx.createGain();
          osc1.connect(gain1);
          gain1.connect(audioCtx.destination);
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
          gain1.gain.setValueAtTime(0.08, audioCtx.currentTime);
          gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
          osc1.start();
          osc1.stop(audioCtx.currentTime + 0.3);
          
          setTimeout(() => {
            const osc2 = audioCtx.createOscillator();
            const gain2 = audioCtx.createGain();
            osc2.connect(gain2);
            gain2.connect(audioCtx.destination);
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
            gain2.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
            osc2.start();
            osc2.stop(audioCtx.currentTime + 0.5);
          }, 110);
        } catch (soundErr) {
          console.warn('Audio chime failed:', soundErr);
        }

        // Show toast notification if we are not currently viewing the chat page
        if (window.location.pathname !== '/chat') {
          showNotification(
            'info',
            'New Message',
            `${sender?.name || 'User'}: ${data.message.message || 'Sent an attachment'}`
          );
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser?._id, queryClient]);

  useEffect(() => {
    const handleResize = () => {
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);
  const setCollapsed = (val: boolean) => {
    const collapsed = !isExpanded;
    if (val !== collapsed) {
      dispatch(setToggleSidebar());
    }
  };
  const setIsDark = (val: boolean) => {
    dispatch(setToggleTheme(val ? 'dark' : 'light'));
  };
  const brandColor = '#e86424';
  return (
    <ConfigProvider
      theme={{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: brandColor,
          colorBgContainer: 'var(--surface)', 
          colorBgElevated: 'var(--surface)', 
          colorBorderSecondary: 'var(--border)',
        },
        components: {
          Layout: { headerBg: 'var(--surface)', siderBg: 'var(--surface)' }
        }
      }}
    >
      <Layout style={{ minHeight: '100vh', background: 'var(--background)' }}>
        <Sidebar isExpanded={isExpanded} />
        <Layout style={{ background: 'transparent' }}>
          <DashboardHeader collapsed={!isExpanded} setCollapsed={setCollapsed} isDark={isDark} setIsDark={setIsDark} />
          <Layout.Content 
            style={{ 
              margin: '16px 18px', 
              padding: 16, 
              minHeight: 280, 
              borderRadius: 12, 
              background: 'var(--surface)', 
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-card)',
              color: 'var(--foreground)',
              transition: 'all 0.2s ease',
              overflow: 'hidden'
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, scale: 0.985, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.985, y: -10 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </Layout.Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default DashboardLayout;