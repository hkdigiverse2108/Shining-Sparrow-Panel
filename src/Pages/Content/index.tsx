import { useState, type FC } from 'react';
import { Input, Modal } from 'antd';
import { DownloadOutlined, FolderOutlined, SearchOutlined, SoundOutlined } from '@ant-design/icons';
import { BREADCRUMBS } from '@/Data';
import { CommonPageWrapper, CommonBreadcrumbs, CommonFormModal, AssetGrid } from '@/Components';
import { CommonButton, showNotification } from '@/Attribute';
import { useAppDispatch, useAppSelector } from '@/Store/hooks';
import { addMedia, deleteMedia, type MediaItem } from '@/Store/Slices/MediaSlice';
import { motion } from 'motion/react';
import { cardRevealUp } from '@/Utils/animations';

const Content: FC = () => {
  const dispatch = useAppDispatch();
  const assets = useAppSelector(state => state.media.data);
  const categories = useAppSelector(state => state.categories.data);
  
  const [selectedCat, setSelectedCat] = useState('All');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  const filteredAssets = assets.filter(a => 
    (selectedCat === 'All' || a.category === selectedCat) && 
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddAsset = (v: any) => {
    dispatch(addMedia({ 
      id: Date.now(), 
      name: v.name || 'asset', 
      url: v.url || '#', 
      type: v.type || 'image', 
      category: v.category || 'Development', 
      size: v.size || '100 KB', 
      uploadedAt: new Date().toLocaleDateString('en-GB') 
    } as MediaItem));
    setIsModalOpen(false); 
    showNotification('success', 'Asset Added', 'Course asset has been successfully added.');
  };

  return (
    <>
      <CommonBreadcrumbs title="Course Asset Manager" breadcrumbs={BREADCRUMBS.CONTENT.BASE} />
      <CommonPageWrapper>
        <motion.div {...cardRevealUp} className="content-layout">
          <div className="content-left-panel">
            <h3 className="left-panel-title">Course Categories</h3>
            <div className="left-panel-list scrollbar-hide">
              <button
                onClick={() => setSelectedCat('All')}
                className={`left-panel-btn mb-1 ${
                  selectedCat === 'All' ? 'bg-primary text-white shadow-sm shadow-primary/30' : 'text-muted hover:bg-surface-muted hover:text-foreground'
                }`}
              >
                <span className="left-panel-btn-content"><FolderOutlined /> All Files</span>
                <span className={`left-panel-badge ${selectedCat === 'All' ? 'bg-white/20' : 'bg-surface-muted'}`}>{assets.length}</span>
              </button>

              {categories.map(cat => {
                const count = assets.filter(a => a.category === cat.name).length;
                const isActive = selectedCat === cat.name;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCat(cat.name)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive ? 'bg-primary text-white shadow-sm shadow-primary/30' : 'text-muted hover:bg-surface-muted hover:text-foreground'
                    }`}
                  >
                    <span className="left-panel-btn-content">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: isActive ? '#fff' : cat.color }} />
                      {cat.name}
                    </span>
                    {count > 0 && (
                      <span className={`left-panel-badge ${isActive ? 'bg-white/20' : 'bg-surface-muted'}`}>{count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT PANEL: Unified Asset Display */}
          <div className="content-right-panel">
            <div className="right-panel-header">
              <div>
                <h2 className="rignt-panel-assets">{selectedCat} Assets</h2>
                <p className="rigth-asset-length">{filteredAssets.length} files available</p>
              </div>
              <div className="right-panel-toolbar">
                <Input placeholder="Search assets..." prefix={<SearchOutlined className="text-muted" />} value={search} onChange={e => setSearch(e.target.value)} className="bg-surface-muted border-border rounded-lg md:w-64" />
                <CommonButton type="primary" onClick={() => setIsModalOpen(true)} className="rounded-lg">Add Asset</CommonButton>
              </div>
            </div>
            <div className="asset-grid-container">
              <AssetGrid assets={filteredAssets} categories={categories} onDelete={(id) => dispatch(deleteMedia(id))} onPreview={setPreviewItem} />
            </div>
          </div>
        </motion.div>
      </CommonPageWrapper>
      <Modal 
        open={previewItem !== null} 
        onCancel={() => setPreviewItem(null)} 
        footer={null} 
        width={800} 
        centered
        destroyOnClose
        title={<span className="modal-title">{previewItem?.name}</span>}
        styles={{
          header: { background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '16px 24px', marginBottom: 0 },
          body: { background: 'var(--surface)', padding: '24px' },
        }}
        closeIcon={<span className="modal-close-icon">✕</span>}
      >
        {previewItem && (
          <div className="modal-body-wrapper">
            {previewItem.type === 'image' && (
              <img src={previewItem.url} alt={previewItem.name} className="w-full max-h-[70vh] object-contain mx-auto" />
            )}
            {previewItem.type === 'video' && (
              <video src={previewItem.url} controls autoPlay className="w-full max-h-[70vh] bg-black rounded-lg" />
            )}
            {previewItem.type === 'audio' && (
              <div className="audio-preview-container">
                <SoundOutlined className="text-6xl text-orange-400" />
                <audio src={previewItem.url} controls autoPlay className="w-full max-w-md" />
              </div>
            )}
            {previewItem.type === 'doc' && (
              <div className="doc-preview-wrapper">
                <iframe 
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(previewItem.url)}&embedded=true`} 
                  title={previewItem.name} 
                  className="w-full h-[60vh] border-0 rounded-lg bg-white" 
                />
                <div className="doc-btn-wrapper">
                  <a href={previewItem.url} target="_blank" rel="noreferrer">
                    <CommonButton type="primary" icon={<DownloadOutlined />}>Download / Open in New Tab</CommonButton>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <CommonFormModal 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)} 
        onSubmit={handleAddAsset} 
        title="Add Course Asset" 
        okText="Add Asset" 
        fields={[
          { name: 'name', label: 'File Name', placeholder: 'e.g. Lecture 1.mp4', rules: [{ required: true }] },
          { name: 'type', label: 'File Type', placeholder: 'image, video, audio, doc' },
          { name: 'url', label: 'URL (Leave blank for docs)', placeholder: 'https://...' },
          { name: 'category', label: 'Course Category', placeholder: 'e.g. Development, Design' },
          { name: 'size', label: 'File Size', placeholder: 'e.g. 45 MB' }
        ]} 
      />
    </>
  );
};

export default Content;