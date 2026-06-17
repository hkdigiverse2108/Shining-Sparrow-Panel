import React from 'react';
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';
import { CommonButton } from '@/Attribute';
import { ROUTES } from '@/Constants';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for the parallax movement
  const springConfig = { damping: 30, stiffness: 150, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Different movement speeds for different layers (depth)
  const blob1X = useTransform(smoothX, [-0.5, 0.5], [40, -40]);
  const blob1Y = useTransform(smoothY, [-0.5, 0.5], [40, -40]);  
  const blob2X = useTransform(smoothX, [-0.5, 0.5], [-30, 30]);
  const blob2Y = useTransform(smoothY, [-0.5, 0.5], [-30, 30]);
  const textX = useTransform(smoothX, [-0.5, 0.5], [15, -15]);
  const textY = useTransform(smoothY, [-0.5, 0.5], [15, -15]);
  const handleMouseMove = (e: React.MouseEvent) => {
    // Get mouse position normalized from -0.5 to 0.5
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };
  const glitchAnimation = {
    x: [0, -2, 3, 0, -1, 2, 0],
    skewX: [0, 2, -3, 0, 1, -2, 0],
    opacity: [1, 0.8, 1, 0.9, 1, 0.8, 1],
    filter: [
      'blur(0px)',
      'blur(1px)',
      'blur(0px)',
      'blur(0.5px)',
      'blur(0px)',
      'blur(1px)',
      'blur(0px)',
    ],
  };

  return (
    <motion.div className="not-found-page" onMouseMove={handleMouseMove} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} >
      <motion.div className="not-found-blob w-96 h-96 -top-20 -left-20" style={{ x: blob1X, y: blob1Y }} />
      <motion.div className="not-found-blob w-80 h-80 -bottom-20 -right-20" style={{ x: blob2X, y: blob2Y }} />
      <motion.div className="not-found-blob w-64 h-64 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ x: blob1X, y: blob2Y }} />
      <motion.div className="not-found-code-wrapper" style={{ x: textX, y: textY, rotateY: textX, rotateX: textY }} >
        <motion.div 
          className="not-found-code"
          animate={glitchAnimation}
          transition={{ 
            duration: 4, 
            ease: "linear", 
            repeat: Infinity, 
            repeatDelay: 3
          }}
        >
          404
        </motion.div>
        <motion.h1 className="not-found-title">
          Page not found
        </motion.h1>
        <motion.p className="not-found-desc">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </motion.p>
        <motion.div className="not-found-actions">
          <CommonButton type="primary" size="large" icon={<HomeOutlined />} onClick={() => navigate(ROUTES.DASHBOARD)} >
            Back to Dashboard
          </CommonButton>
          <CommonButton size="large" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} >
            Go Back
          </CommonButton>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;