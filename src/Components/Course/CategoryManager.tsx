import { useState, useMemo } from 'react';
import { Button, Input, Space, Tooltip, message } from 'antd';
import { PlusOutlined, CheckOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/Store/hooks';
import { addCategory, deleteCategory } from '@/Store/Slices/CategorySlice';
import { CommonTag } from '@/Components';

const colorOptions = [
  '#5B8FF9', '#5AD8A6', '#5D7092', '#F6BD16', '#E86452', '#6DC8EC', 
  '#945FB9', '#FF9845', '#1E9493', '#FF99C3', '#D9A8E6', 
  '#F97F61', '#A06BFF', '#48C9B0', '#E74C3C', '#F39C12', '#16A085', 
  '#1ABC9C', '#2ECC71', '#34495E', '#E67E22', '#95A5A6', '#D35400', 
  '#C0392B', '#7F8C8D', '#BDC3C7', '#2C3E50',
  '#108ee9', '#eb2f96', '#fa8c16', '#722ed1', '#13c2c2', '#52c41a'
];

export const CategoryManager = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.categories.data);
  const [newCat, setNewCat] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);

  const usedColors = useMemo(() => new Set(categories.map(c => c.color)), [categories]);

  const handleColorClick = (color: string) => {
    setSelectedColor(color);
  };

  const handleAdd = () => {
    if (!newCat.trim()) return message.warning('Category name is required');
    
    dispatch(addCategory(newCat.trim(), selectedColor));
    setNewCat('');
    message.success('Category added!');
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-surface-muted border border-border">
        <h4 className="text-sm font-bold mb-3 text-foreground">Add New Category</h4>
        <Space.Compact style={{ width: '100%' }}>
          <Input placeholder="Category name..." value={newCat} onChange={e => setNewCat(e.target.value)} 
            onPressEnter={handleAdd} />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add</Button>
        </Space.Compact>
        <div className="grid grid-cols-10 gap-2 mt-4">
          {colorOptions.map(color => {
            const isUsed = usedColors.has(color);
            const isSelected = selectedColor === color;
            
            return (
              <Tooltip key={color} title={isUsed ? `${color} (In use, click to select anyway)` : color}>
                <button 
                  onClick={() => handleColorClick(color)}
                  style={{ 
                    backgroundColor: color,
                    cursor: 'pointer',
                    boxShadow: isUsed && !isSelected ? 'inset 0 0 0 2px rgba(255,255,255,0.5)' : 'none'
                  }}
                  className="relative w-6 h-6 rounded-full transition-all hover:scale-110 flex items-center justify-center"
                >
                  {isSelected && (
                    <CheckOutlined style={{ color: '#fff', fontSize: '10px', fontWeight: 'bold' }} />
                  )}
                </button>
              </Tooltip>
            );
          })}
        </div>
      </div>
      <div>
        <h4 className="text-sm font-bold mb-3 text-foreground">Existing Categories ({categories.length})</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <CommonTag key={cat.id} color={cat.color} closable onClose={(e: React.MouseEvent) => { 
                e.preventDefault(); 
                dispatch(deleteCategory(cat.id)); 
                message.success('Deleted!'); 
              }}
              className="px-2.5 py-1 rounded-full text-xs font-semibold bg-background!"
            >
              {cat.name}
            </CommonTag>
          ))}
        </div>
      </div>
    </div>
  );
};