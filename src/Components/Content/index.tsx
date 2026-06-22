import type { FC } from 'react';
import { Empty } from 'antd'; 
import { DeleteOutlined, EyeOutlined, FilePdfOutlined, FileTextOutlined, FileImageOutlined, PlayCircleFilled, SoundOutlined } from '@ant-design/icons';
import type { MediaItem } from '@/Store/Slices/MediaSlice';

interface AssetGridProps {
  assets: MediaItem[];
  categories: any[];
  onDelete: (id: number) => void;
  onPreview: (item: MediaItem) => void;
}

export const AssetGrid: FC<AssetGridProps> = ({ assets, categories, onDelete, onPreview }) => {
  const getTypeConfig = (type: string, category: string) => {
    const catData = categories.find(c => c.name === category);
    const color = catData?.color || '#8c8c8c';

    if (type === 'image') return { isMedia: true, icon: <FileImageOutlined />, color };
    if (type === 'video') return { isMedia: true, icon: <PlayCircleFilled />, color };
    if (type === 'audio') return { isMedia: false, icon: <SoundOutlined />, color: '#fa8c16' }; 
    if (type === 'doc') return { isMedia: false, icon: <FilePdfOutlined />, color: '#ff4d4f' }; 
    return { isMedia: false, icon: <FileTextOutlined />, color: '#1677ff' };
  };

  if (assets.length === 0) {
    return <Empty description={<span className="text-muted">No assets in this category</span>} className="py-20" />;
  }

  return (
    <div className="asset-grid-wrapper">
      {assets.map(item => {
        const config = getTypeConfig(item.type, item.category);
        return (
          <div key={item.id} className="group asset-card">
            <div className="asset-visual-layer">
              {config.isMedia ? (
                <>
                  <img src={item.thumbnail || item.url} alt={item.name} className="asset-media-img" />
                  {item.type === 'video' && (
                    <div className="asset-video-overlay">
                      <div className="asset-play-icon-wrapper">
                        <PlayCircleFilled className="text-3xl" />
                      </div>
                    </div>
                  )}
                  <div className="asset-gradient-overlay" />
                </>
              ) : (
                <div className="asset-doc-bg" style={{ background: `linear-gradient(135deg, ${config.color}15 0%, transparent 100%)` }}>
                  <div className="asset-doc-icon-box" style={{ backgroundColor: `${config.color}20`, color: config.color }}>
                    {config.icon}
                  </div>
                  <span className="asset-doc-label" style={{ color: config.color }}>
                    {item.type === 'doc' ? 'Document' : 'Audio File'}
                  </span>
                </div>
              )}
            </div>
            <div className="asset-actions">
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); onPreview(item); }} 
                className="asset-action-btn border border-white/20 cursor-pointer"
              >
                <EyeOutlined style={{ fontSize: '12px' }} />
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-danger transition-colors border border-white/20 cursor-pointer" > <DeleteOutlined style={{ fontSize: '12px' }} /> </button>
            </div>

            {/* Footer Info */}
            <div className="asset-footer">
              <p className="asset-file-name">{item.name}</p>
              <span className="asset-file-size">{item.size}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};