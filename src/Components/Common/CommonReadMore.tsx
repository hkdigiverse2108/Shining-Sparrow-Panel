import React, { useState } from 'react';
import { Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

interface ReadMoreProps {
  htmlContent: string;
  maxHeight?: number;
  className?: string;
}

export const CommonReadMore: React.FC<ReadMoreProps> = ({ 
  htmlContent, 
  maxHeight = 90, 
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!htmlContent) return null;

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      <div 
        className="transition-all duration-300 overflow-hidden relative"
        style={{ 
          maxHeight: isExpanded ? 'none' : `${maxHeight}px`,
        }}
      >
        <div 
          className="text-text-muted text-sm leading-relaxed" 
          dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
        )}
      </div>
      <div className="flex justify-start">
        <Button 
          type="link" 
          size="small" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-0 text-xs font-semibold text-primary hover:text-active flex items-center gap-1 mt-1"
        >
          {isExpanded ? (
            <>
              Read Less <UpOutlined className="text-[10px]" />
            </>
          ) : (
            <>
              Read More <DownOutlined className="text-[10px]" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
