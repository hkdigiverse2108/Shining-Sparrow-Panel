import { useState, useMemo, type FC } from 'react';
import { Avatar, Button, Popconfirm, message } from 'antd';
import { StarFilled, UserOutlined, DeleteOutlined, PlusOutlined, ArrowRightOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/Constants';
import { BREADCRUMBS } from '@/Data';
import { CommonPageWrapper, CommonBreadcrumbs, CourseForm, CommonDrawer, CategoryManager } from '@/Components';
import { motion } from 'motion/react';
import { cardRevealUp } from '@/Utils/animations';
import { addCourse, deleteCourse } from '@/Store/Slices/CourseSlice';
import { useAppDispatch, useAppSelector } from '@/Store/hooks';
import { CommonButton } from '@/Attribute';

type Course = any; // Simplified for brevity

const sortConfig: Record<string, (a: Course, b: Course) => number> = {
  popular: (a, b) => b.rating - a.rating,
  newest: (a, b) => b.id - a.id,
  'price-low': (a, b) => parseFloat(a.price.slice(1)) - parseFloat(b.price.slice(1)),
  'price-high': (a, b) => parseFloat(b.price.slice(1)) - parseFloat(a.price.slice(1)),
};

const Courses: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const courses = useAppSelector(state => state.courses.data);
  const reduxCategories = useAppSelector(state => state.categories.data);
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCatDrawerOpen, setIsCatDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Dynamically generate color map and categories array from Redux
  const categoryColorMap = useMemo(() => {
    const map: Record<string, string> = { default: 'var(--secondary)' };
    reduxCategories.forEach(c => map[c.name] = c.color);
    return map;
  }, [reduxCategories]);

  const categories = ['all', ...reduxCategories.map(c => c.name)];

  const addInitialValues = { title: '', instructor: '', category: '', price: '', rating: 4.5, image: '', description: '', status: 'draft' };

  const handleAddCourse = (values: any) => {
    dispatch(addCourse({ id: Date.now(), ...values, curriculum: [], enrollmentsCount: 0, createdAt: new Date().toLocaleDateString("en-GB") }));
    setIsDrawerOpen(false);
    message.success('Course created successfully!');
  };

  const filteredCourses = useMemo(() => {
    let result = [...courses];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => c.title?.toLowerCase().includes(q) || c.instructor?.toLowerCase().includes(q) );
    }
    if (selectedCategory !== 'all') result = result.filter(c => c.category === selectedCategory);
    return result.sort(sortConfig[sortBy] || (() => 0));
  }, [searchQuery, selectedCategory, sortBy, courses]);

  const getCategoryStyle = (category: string, isActive = false) => {
    const color = categoryColorMap[category] || categoryColorMap.default;
    return { 
      color: isActive ? '#fff' : color, 
      backgroundColor: isActive ? color : `color-mix(in srgb, ${color} ${isActive ? '100%' : '10%'}, transparent)`,
      boxShadow: isActive ? `0 2px 8px color-mix(in srgb, ${color} 30%, transparent)` : 'none'
    };
  };

  return (
    <>
      <CommonBreadcrumbs title="Courses" breadcrumbs={BREADCRUMBS.COURSE.BASE} />
      <CommonPageWrapper>
        <motion.div {...cardRevealUp}>
          <div className="course-header flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <div>
              <span className="course-acedamy text-xs text-muted">Academy</span>
              <h2 className="course-catalog text-xl font-bold text-foreground">Course Catalog</h2>
            </div>
            <div className="course-header-right">
              <CommonButton type="primary" icon={<PlusOutlined />} size="middle" onClick={() => setIsDrawerOpen(true)} className="course-add">
                New Course
              </CommonButton>
              <div className="course-search">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="bg-surface border border-border rounded-full px-3 py-1.5 text-xs text-foreground placeholder-muted focus:outline-none focus:ring-1 focus:ring-primary transition-all w-full md:w-44" 
                />
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)} 
                  className="bg-surface border border-border rounded-full px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-semibold cursor-pointer"
                >
                  <option value="popular">Popular</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price ↑</option>
                  <option value="price-high">Price ↓</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Pills with Manage Button */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
            {categories.map(cat => {
              const isActive = selectedCategory === cat;
              return (
                <button key={cat} onClick={() => setSelectedCategory(cat)} style={getCategoryStyle(cat === 'all' ? 'default' : cat, isActive)} className="px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all border border-transparent focus:outline-none">
                  {cat === 'all' ? 'All' : cat}
                </button>
              );
            })}
            <Button size="small" icon={<SettingOutlined />} onClick={() => setIsCatDrawerOpen(true)} className="flex-shrink-0 !rounded-full !text-xs ml-2">Manage</Button>
          </div>

          {/* Editorial Split Layout */}
          <div className="flex flex-col lg:flex-row gap-0 lg:gap-8 min-h-[60vh]">
            <div className="w-full lg:w-1/2 flex flex-col">
              {filteredCourses.map((course, index) => {
                const isHovered = hoveredId === course.id;
                const catColor = categoryColorMap[course.category] || categoryColorMap.default;
                return (
                  <div key={course.id} onMouseEnter={() => setHoveredId(course.id)} onMouseLeave={() => setHoveredId(null)} onClick={() => navigate(`${ROUTES.COURSE.BASE}/${course.id}`)} className="group relative flex items-center py-3 border-b border-border cursor-pointer transition-all duration-300 gap-4" style={{ borderColor: isHovered ? catColor : undefined, backgroundColor: isHovered ? `color-mix(in srgb, ${catColor} 5%, transparent)` : 'transparent' }}>
                    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 lg:hidden border border-border"><img src={course.image} alt={course.title} className="w-full h-full object-cover" /></div>
                    <div className="hidden lg:flex w-10 flex-shrink-0 transition-all duration-300 items-center justify-center" style={{ color: isHovered ? catColor : 'var(--border)' }}><span className="text-2xl font-black">{String(index + 1).padStart(2, '0')}</span></div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: catColor }}>{course.category}</span>
                      <h3 className="text-sm md:text-base font-bold text-foreground mt-0.5 truncate group-hover:text-primary transition-colors">{course.title}</h3>
                      <div className="flex items-center gap-2 mt-1"><Avatar size={16} icon={<UserOutlined />} style={{ backgroundColor: 'var(--secondary)' }} /><span className="text-[11px] font-medium text-secondary">{course.instructor}</span></div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="lg:hidden text-xs font-bold text-foreground mr-1">{course.price}</span>
                      <Popconfirm title="Delete?" onConfirm={(e) => { e?.stopPropagation(); dispatch(deleteCourse(course.id)); message.success('Deleted!'); }} okButtonProps={{ danger: true }}>
                        <Button type="text" danger icon={<DeleteOutlined />} className="opacity-0 group-hover:opacity-100 transition-all hover:scale-110 !w-6 !h-6 text-xs" onClick={(e) => e.stopPropagation()} />
                      </Popconfirm>
                      <ArrowRightOutlined className="text-[10px] text-muted group-hover:text-foreground transition-all group-hover:translate-x-0.5" />
                    </div>
                  </div>
                );
              })}
              {filteredCourses.length === 0 && (<div className="flex flex-col items-center justify-center py-16 text-muted w-full"><h3 className="text-sm font-bold text-foreground mb-1">No Courses Found</h3><p className="text-xs text-center">Adjust your search or filters.</p></div>)}
            </div>

            <div className="hidden lg:block w-1/2 sticky top-20 self-start h-[calc(100vh-8rem)] rounded-2xl overflow-hidden shadow-xl border border-border">
              {filteredCourses.map(course => {
                const isHovered = hoveredId === course.id;
                const catStyle = getCategoryStyle(course.category);
                return (
                  <div key={course.id} className="absolute inset-0 transition-all duration-700 ease-out" style={{ opacity: isHovered ? 1 : 0, transform: isHovered ? 'scale(1)' : 'scale(1.05)', zIndex: isHovered ? 10 : 1 }}>
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl border border-white/20 bg-black/50 backdrop-blur-xl shadow-xl flex items-end justify-between">
                      <div className="min-w-0"><span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ ...catStyle, backgroundColor: `color-mix(in srgb, ${catStyle.color} 30%, transparent)` }}>{course.category}</span><h4 className="text-white text-sm font-bold mt-1.5 truncate drop-shadow-md">{course.title}</h4></div>
                      <div className="text-right flex-shrink-0 ml-3"><div className="text-xl font-black text-white drop-shadow-md">{course.price}</div><div className="flex items-center gap-1 text-warning text-xs mt-0.5 justify-end"><StarFilled className="text-[10px]" /> <span className="font-bold text-white">{course.rating}</span></div></div>
                    </div>
                  </div>
                );
              })}
              {!hoveredId && filteredCourses.length > 0 && (<div className="absolute inset-0 flex flex-col items-center justify-center bg-surface z-0 transition-opacity duration-500"><span className="text-6xl font-black text-border/30">←</span><p className="text-muted mt-2 font-medium text-sm">Hover a course to preview</p></div>)}
            </div>
          </div>
        </motion.div>
      </CommonPageWrapper>

      {/* Drawers */}
      <CommonDrawer title="Add New Course" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <CourseForm initialValues={addInitialValues} onSubmit={handleAddCourse} isEditing={false} />
      </CommonDrawer>
      
      <CommonDrawer title="Manage Categories" open={isCatDrawerOpen} onClose={() => setIsCatDrawerOpen(false)}>
        <CategoryManager />
      </CommonDrawer>
    </>
  );
};

export default Courses;