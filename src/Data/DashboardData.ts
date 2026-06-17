import type { UserTable } from "@/Types";

export interface Course {
  id: number;
  title: string;
  progress?: number;
  lesson?: string;
  img?: string;
  instructor?: string;
  duration?: string;
  category?: string;
}

export interface Workshop {
  id: number;
  title: string;
  date: string;
  time?: string;
  tag: string;
  actionText: string;
}

export interface StatItem {
  title: string;
  value: string | number;
  suffix?: string;
  icon: React.ReactNode;
  trend?: string; // "+12%" or "-5%"
  color?: string;
}

export interface DashboardNotice {
  id: number;
  title: string;
  desc: string;
  time: string;
  color: string;
}

export interface DashboardInstructor {
  id: number;
  name: string;
  coursesCount: string;
  avatar: string;
}

export interface SchoolPerformance {
  name: string;
  value: number;
  color: string;
}

export const dashboardUserInfo = {
  name: "Alex",
  goalPercentage: 70,
  goalText: "12 of 20 hours completed",
};

export const dashboardStats: StatItem[] = [
  {
    title: "Hours Learned",
    value: 48,
    suffix: "h",
    icon: "⏱",
    trend: "+12%",
    color: "#3b82f6"
  },
  {
    title: "Courses in Progress",
    value: 4,
    icon: "📚",
    trend: "+2",
    color: "#f59e0b"
  },
  {
    title: "Certificates",
    value: 12,
    icon: "🎓",
    trend: "+1",
    color: "#10b981"
  }
];

export const continueLearningData: Course[] = [
  {
    id: 1,
    title: 'Advanced React Patterns',
    progress: 75,
    lesson: 'Hooks Deep Dive',
    category: 'Development',
    img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    title: 'UI/UX Design Principles',
    progress: 30,
    lesson: 'Color Theory',
    category: 'Design',
    img: 'https://images.unsplash.com/photo-1561070791-26c113006238?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    title: 'Node.js Backend Architecture',
    progress: 90,
    lesson: 'Deployment Strategies',
    category: 'Backend',
    img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80'
  }
];

export const recommendedCoursesData: Course[] = [
  { id: 4, title: 'Full Stack Development', instructor: 'Jane Doe', duration: '12h 30m', category: 'Development' },
  { id: 5, title: 'Python for Data Science', instructor: 'Dr. Smith', duration: '8h 15m', category: 'Data' },
  { id: 6, title: 'Digital Marketing 101', instructor: 'Mark Evans', duration: '5h 00m', category: 'Marketing' },
];

export const upcomingWorkshopsData: Workshop[] = [
  {
    id: 1,
    title: 'Live Q&A: Career Growth',
    date: 'Tomorrow, 10:00 AM',
    tag: 'Upcoming',
    actionText: 'Set Reminder'
  }
];

export const mockCourses = [
  { id: 1,
    title: "React Masterclass 2026",
    instructor: "John Doe",
    instructorTitle: "Senior Frontend Engineer",
    category: "Development",
    price: "$49",
    fullPrice: "$49.99",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80",
    description: "This course includes 24 hours of video, 10 articles, and downloadable resources. Master React from scratch to advanced patterns.",
    curriculum: [
      { title: 'Introduction to the Course', duration: '10:00', completed: true, locked: false },
      { title: 'Setting up the Environment', duration: '15:30', completed: true, locked: false },
      { title: 'Your First Component', duration: '20:45', completed: false, locked: false },
      { title: 'State Management Basics', duration: '25:00', completed: false, locked: true },
    ],
  },
  {
    id: 2,
    title: "TypeScript Deep Dive",
    instructor: "Sarah Smith",
    instructorTitle: "Lead Software Architect",
    category: "Development",
    price: "$59",
    fullPrice: "$59.99",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
    description: "Deep dive into TypeScript features. 18 hours of video, 15 coding exercises, and real-world projects.",
    curriculum: [
      { title: 'TS Setup & Config', duration: '08:00', completed: true, locked: false },
      { title: 'Basic Types & Interfaces', duration: '22:30', completed: false, locked: false },
      { title: 'Advanced Generics', duration: '30:00', completed: false, locked: true },
    ],
  },
  {
    id: 3,
    title: "Node.js Backend Development",
    instructor: "Mike Ross",
    instructorTitle: "Backend Developer",
    category: "Backend",
    price: "$45",
    fullPrice: "$45.99",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
    description: "Build scalable backends. 30 hours of video and 5 full projects.",
    curriculum: [
      { title: 'Node Basics', duration: '12:00', completed: true, locked: false },
      { title: 'Express & Routing', duration: '18:30', completed: false, locked: false },
      { title: 'Database Integration', duration: '35:00', completed: false, locked: true },
    ],
  },
  {
    id: 4,
    title: "UI/UX Design Fundamentals",
    instructor: "Emily Clark",
    instructorTitle: "Lead Product Designer",
    category: "Design",
    price: "$39",
    fullPrice: "$39.99",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
    description: "Learn user-centered design principles, wireframing, and prototyping with Figma. 15 hours of content.",
    curriculum: [
      { title: 'Design Thinking Basics', duration: '14:00', completed: true, locked: false },
      { title: 'Wireframing in Figma', duration: '25:00', completed: false, locked: false },
      { title: 'Prototyping & Testing', duration: '20:00', completed: false, locked: true },
    ],
  },
  {
    id: 5,
    title: "Digital Marketing Strategy",
    instructor: "Olivia Wilson",
    instructorTitle: "Marketing Director",
    category: "Marketing",
    price: "$35",
    fullPrice: "$35.99",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
    description: "Master SEO, social media, and PPC campaigns. 12 hours of video and real-world case studies.",
    curriculum: [
      { title: 'SEO Fundamentals', duration: '18:00', completed: true, locked: false },
      { title: 'Social Media Marketing', duration: '22:00', completed: false, locked: false },
      { title: 'Google Ads & PPC', duration: '16:00', completed: false, locked: true },
    ],
  },
  {
    id: 6,
    title: "Data Science with Python",
    instructor: "David Johnson",
    instructorTitle: "Senior Data Scientist",
    category: "Data Science",
    price: "$69",
    fullPrice: "$69.99",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    description: "Analyze data using Python, Pandas, and Machine Learning. 28 hours of hands-on tutorials.",
    curriculum: [
      { title: 'Python for Data Science', duration: '20:00', completed: true, locked: false },
      { title: 'Data Manipulation with Pandas', duration: '28:00', completed: false, locked: false },
      { title: 'Intro to Machine Learning', duration: '35:00', completed: false, locked: true },
    ],
  },
  {
    id: 7,
    title: "AWS Cloud Practitioner",
    instructor: "Sophia Lee",
    instructorTitle: "Cloud Solutions Architect",
    category: "Cloud",
    price: "$55",
    fullPrice: "$55.99",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    description: "Prepare for the AWS Cloud Practitioner exam. 20 hours of video and practice questions.",
    curriculum: [
      { title: 'Cloud Concepts', duration: '15:00', completed: true, locked: false },
      { title: 'AWS Core Services', duration: '32:00', completed: false, locked: false },
      { title: 'Security & Billing', duration: '18:00', completed: false, locked: true },
    ],
  },
  {
    id: 8,
    title: "Cyber Security Essentials",
    instructor: "James Brown",
    instructorTitle: "Information Security Analyst",
    category: "Security",
    price: "$65",
    fullPrice: "$65.99",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
    description: "Understand threat vectors, network security, and ethical hacking. 22 hours of comprehensive training.",
    curriculum: [
      { title: 'Security Fundamentals', duration: '12:00', completed: true, locked: false },
      { title: 'Network Defense', duration: '24:00', completed: false, locked: false },
      { title: 'Intro to Ethical Hacking', duration: '30:00', completed: false, locked: true },
    ],
  },
  {
    id: 9,
    title: "Mobile App Development",
    instructor: "Emma Taylor",
    instructorTitle: "Mobile App Developer",
    category: "Mobile",
    price: "$59",
    fullPrice: "$59.99",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80",
    description: "Build cross-platform mobile apps with React Native. 26 hours of video and 3 complete apps.",
    curriculum: [
      { title: 'React Native Setup', duration: '10:00', completed: true, locked: false },
      { title: 'UI Components', duration: '22:00', completed: false, locked: false },
      { title: 'API Integration & Deployment', duration: '28:00', completed: false, locked: true },
    ],
  },
  {
    id: 10,
    title: "Business Analytics",
    instructor: "Daniel White",
    instructorTitle: "Business Intelligence Manager",
    category: "Business",
    price: "$42",
    fullPrice: "$42.99",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
    description: "Transform data into business insights. 14 hours covering Excel, SQL, and Tableau.",
    curriculum: [
      { title: 'Data Analysis Foundations', duration: '16:00', completed: true, locked: false },
      { title: 'SQL for Analytics', duration: '20:00', completed: false, locked: false },
      { title: 'Data Visualization', duration: '18:00', completed: false, locked: true },
    ],
  },
  {
    id: 11,
    title: "Artificial Intelligence Basics",
    instructor: "Sophia Martin",
    instructorTitle: "AI Research Lead",
    category: "AI",
    price: "$79",
    fullPrice: "$79.99",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80",
    description: "Explore neural networks, NLP, and computer vision. 32 hours of cutting-edge content.",
    curriculum: [
      { title: 'AI & ML Overview', duration: '14:00', completed: true, locked: false },
      { title: 'Neural Networks', duration: '26:00', completed: false, locked: false },
      { title: 'Natural Language Processing', duration: '22:00', completed: false, locked: true },
    ],
  },
  {
    id: 12,
    title: "Project Management Professional",
    instructor: "William Scott",
    instructorTitle: "PMP Certified Director",
    category: "Management",
    price: "$50",
    fullPrice: "$50.99",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
    description: "Learn Agile, Scrum, and Waterfall methodologies. 16 hours of project management essentials.",
    curriculum: [
      { title: 'Project Lifecycle', duration: '12:00', completed: true, locked: false },
      { title: 'Agile & Scrum', duration: '20:00', completed: false, locked: false },
      { title: 'Risk Management', duration: '15:00', completed: false, locked: true },
    ],
  },
];

export const mockWorkshops = [
  {
    id: 1,
    title: 'Future of AI in Web Development',
    date: 'Oct 24, 2024',
    time: '10:00 AM - 12:00 PM',
    attendees: 120,
    category: 'AI',
    image: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&w=400&q=80',
    description: 'Join us for an in-depth look at how AI is reshaping the frontend landscape. Learn how to work with next-gen models, prompt engineering, and automated agents.',
    featured: true,
    speaker: {
      name: 'Dr. Alan Turing',
      title: 'AI & Computing Researcher',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bio: 'Dr. Alan Turing is a leading researcher in computational logic, neural systems, and automated agent architectures.'
    },
    agenda: [
      { time: '10:00 AM - 10:30 AM', title: 'Introduction', desc: 'Setting the stage for AI in frontend development.' },
      { time: '10:30 AM - 11:30 AM', title: 'Keynote Address', desc: 'A deep dive into prompt engineering, agentic workflows, and UI generations.' },
      { time: '11:30 AM - 12:00 PM', title: 'Live Q&A Session', desc: 'Interactive discussion and audience questions with Dr. Alan Turing.' }
    ]
  },
  {
    id: 2,
    title: 'Design Systems 101',
    date: 'Nov 05, 2024',
    time: '02:00 PM - 04:00 PM',
    attendees: 85,
    image: 'https://images.unsplash.com/photo-1581291518655-9523c932dedf?auto=format&fit=crop&w=400&q=80',
    description: 'Learn how to build scalable and consistent UI using modern design system principles and tools like Figma and Storybook.',
    featured: false,
    speaker: {
      name: 'Sarah Jenkins',
      title: 'Lead Product Designer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      bio: 'Sarah is a design systems enthusiast who has built component libraries for Fortune 500 companies, focusing on accessibility and scale.'
    },
    agenda: [
      { time: '02:00 PM - 02:45 PM', title: 'Why Design Systems?', desc: 'Understanding the ROI of consistent UI and design tokens.' },
      { time: '02:45 PM - 03:30 PM', title: 'Building Your First Component Library', desc: 'Hands-on walkthrough of creating flexible, themed components in Figma and React.' },
      { time: '03:30 PM - 04:00 PM', title: 'Documentation & Handoff', desc: 'Best practices for Storybook documentation and developer-designer collaboration.' }
    ]
  },
  {
    id: 3,
    title: 'Advanced React Patterns',
    date: 'Nov 12, 2024',
    time: '01:00 PM - 03:00 PM',
    attendees: 95,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80',
    description: 'Deep dive into compound components, render props, and custom hooks for cleaner React architecture.',
    featured: false,
    speaker: {
      name: 'Mark Thompson',
      title: 'Senior Frontend Architect',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      bio: 'Mark has been building complex React applications since the early days and specializes in scalable state management and component APIs.'
    },
    agenda: [
      { time: '01:00 PM - 01:40 PM', title: 'Compound Components', desc: 'Building flexible APIs that share implicit state across children.' },
      { time: '01:40 PM - 02:20 PM', title: 'Hooks Deep Dive', desc: 'Creating custom hooks for side effects, data fetching, and state reduction.' },
      { time: '02:20 PM - 03:00 PM', title: 'Performance Optimization', desc: 'Profiling renders, memoization strategies, and avoiding unnecessary re-renders.' }
    ]
  },
  {
    id: 4,
    title: 'Cloud Infrastructure Basics',
    date: 'Dec 01, 2024',
    time: '11:00 AM - 01:00 PM',
    attendees: 60,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
    description: 'A beginner-friendly guide to AWS, Docker, and deploying your first application to the cloud.',
    featured: false,
    speaker: {
      name: 'Linda Carter',
      title: 'DevOps Engineer',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
      bio: 'Linda is a cloud infrastructure specialist who loves making complex DevOps concepts accessible to frontend and junior developers.'
    },
    agenda: [
      { time: '11:00 AM - 11:40 AM', title: 'Cloud Concepts & AWS Setup', desc: 'Understanding regions, availability zones, and core AWS services.' },
      { time: '11:40 AM - 12:20 PM', title: 'Dockerizing Your App', desc: 'Writing Dockerfiles and building containers for local and production environments.' },
      { time: '12:20 PM - 01:00 PM', title: 'CI/CD & Deployment', desc: 'Automating deployments with GitHub Actions and hosting on AWS/EC2.' }
    ]
  }
];
export const workshopCategoryOptions = [
  { label: "AI", value: "AI" },
  { label: "Design", value: "Design" },
  { label: "Development", value: "Development" },
  { label: "Cloud", value: "Cloud" },
  { label: "Marketing", value: "Marketing" },
];
export const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+91 98765 43210",
  role: "Admin",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
  cover: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
  stats: {
    courses: 12,
    completed: 8,
    certificates: 3,
    hoursLearned: 142
  }
};


export const mockDashboard = {
  stats: [
    { title: 'Enrolled Courses', value: 12, suffix: '', icon: '📚', trend: '12%' },
    { title: 'Completed', value: 8, suffix: '', icon: '🏆', trend: '8%' },
    { title: 'Certificates', value: 3, suffix: '', icon: '🎓', trend: '5%' },
  ],
  hero: {
    name: 'John',
    goalPercentage: 75,
    goalText: '75% Complete',
  },
  continueLearning: mockCourses.slice(0, 2).map(c => ({
    ...c,
    img: c.image,
    lesson: 'Next Lesson',
    progress: Math.floor(Math.random() * 80) + 20,
  })),
  recommended: mockCourses.slice(3, 6).map(c => ({
    ...c,
    duration: '8h 30m',
  })),
  workshop: {
    ...mockWorkshops[0],
    tag: 'Featured',
    actionText: 'Join Now',
  }
};

export const careerTrack = {
  title: "Frontend Developer Career Track",
  description: "Master the modern frontend ecosystem from scratch to advanced architecture.",
  steps: [
    {
      id: 1,
      title: "React Masterclass 2026",
      category: "Development",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=100&q=80",
      progress: 100,
      status: "Completed",
    },
    {
      id: 4,
      title: "UI/UX Design Fundamentals",
      category: "Design",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=100&q=80",
      progress: 75,
      status: "In Progress",
    },
    {
      id: 2,
      title: "TypeScript Deep Dive",
      category: "Development",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=100&q=80",
      progress: 0,
      status: "Upcoming",
    },
    {
      id: 9,
      title: "Mobile App Development",
      category: "Mobile",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=100&q=80",
      progress: 0,
      status: "Upcoming",
    },
  ]
};
export const dbNotices: DashboardNotice[] = [];

export const dbBestInstructors: DashboardInstructor[] = [];

export const dbSchoolPerformance: SchoolPerformance[] = [];

export const initialUsers: UserTable[] = [
  {
    id: 1,
    username: "Alice Johnson",
    email: "alice@example.com",
    password: "alice123",
    role: "admin",
    status: "active",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    phone: "+1 234 567 8901",
    gender: "female",
    dateOfBirth: "1990-05-12",
    address: "123 Admin Lane, New York, NY",
    permissions: ["read", "write", "delete", "users"],
    lastLogin: "2023-10-25T10:30:00Z",
    createdAt: "12 Jan 2026",
    updatedAt: "25 Oct 2023",
  },
  {
    id: 2,
    username: "Nil Yeager",
    email: "nil.yeager@example.com",
    password: "nil123",
    role: "instructor",
    status: "active",
    profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    phone: "+1 234 567 8902",
    gender: "male",
    dateOfBirth: "1985-11-30",
    address: "456 Instructor Ave, Los Angeles, CA",
    permissions: ["read", "write"],
    lastLogin: "2023-10-24T09:15:00Z",
    createdAt: "25 Feb 2026",
    updatedAt: "24 Oct 2023",
  },
  {
    id: 3,
    username: "Theron Trump",
    email: "theron@example.com",
    password: "theron123",
    role: "instructor",
    status: "active",
    profileImage: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
    phone: "+1 234 567 8903",
    gender: "male",
    dateOfBirth: "1978-02-15",
    address: "789 Teach St, Chicago, IL",
    permissions: ["read", "write"],
    lastLogin: "2023-10-20T14:00:00Z",
    createdAt: "03 Mar 2026",
    updatedAt: "20 Oct 2023",
  },
  {
    id: 4,
    username: "Tyler Mark",
    email: "tyler.mark@example.com",
    password: "tyler123",
    role: "instructor",
    status: "blocked",
    profileImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80",
    phone: "+1 234 567 8904",
    gender: "male",
    dateOfBirth: "1992-07-22",
    address: "101 Block Rd, Houston, TX",
    permissions: ["read"],
    lastLogin: "2023-09-15T08:45:00Z",
    createdAt: "18 Apr 2026",
    updatedAt: "15 Sep 2023",
  },
  {
    id: 5,
    username: "Johen Mark",
    email: "johen.m@example.com",
    password: "johen123",
    role: "instructor",
    status: "active",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    phone: "+1 234 567 8905",
    gender: "male",
    dateOfBirth: "1988-09-01",
    address: "222 Scholar Dr, Phoenix, AZ",
    permissions: ["read", "write"],
    lastLogin: "2023-10-22T16:30:00Z",
    createdAt: "22 Apr 2026",
    updatedAt: "22 Oct 2023",
  },
  {
    id: 6,
    username: "Emma Watson",
    email: "emma@example.com",
    password: "emma123",
    role: "student",
    status: "active",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    phone: "+1 234 567 8906",
    gender: "female",
    dateOfBirth: "1999-12-05",
    address: "333 Student Blvd, Philadelphia, PA",
    permissions: ["read"],
    lastLogin: "2023-10-25T11:20:00Z",
    createdAt: "05 May 2026",
    updatedAt: "25 Oct 2023",
  },
  {
    id: 7,
    username: "John Doe",
    email: "john.doe@example.com",
    password: "john123",
    role: "student",
    status: "inactive",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    phone: "+1 234 567 8907",
    gender: "male",
    dateOfBirth: "2000-01-14",
    address: "444 Dorm Way, San Antonio, TX",
    permissions: ["read"],
    lastLogin: "2023-08-10T07:00:00Z",
    createdAt: "14 May 2026",
    updatedAt: "10 Aug 2023",
  },
  {
    id: 8,
    username: "Sarah Connor",
    email: "sarah.c@example.com",
    password: "sarah123",
    role: "student",
    status: "active",
    profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    phone: "+1 234 567 8908",
    gender: "female",
    dateOfBirth: "1995-06-01",
    address: "555 Campus Ct, San Diego, CA",
    permissions: ["read"],
    lastLogin: "2023-10-24T15:45:00Z",
    createdAt: "01 Jun 2026",
    updatedAt: "24 Oct 2023",
  },
  {
    id: 9,
    username: "Michael Smith",
    email: "michael.s@example.com",
    password: "michael123",
    role: "student",
    status: "active",
    profileImage: "https://api.dicebear.com/7.x/adventurer/svg?seed=Michael",
    phone: "+1 345 678 9012",
    gender: "male",
    dateOfBirth: "2001-03-18",
    address: "666 Uni Ave, Dallas, TX",
    permissions: ["read"],
    lastLogin: "2023-10-23T09:30:00Z",
    createdAt: "15 Jun 2026",
    updatedAt: "23 Oct 2023",
  },
  {
    id: 10,
    username: "Jessica Jones",
    email: "jessica.j@example.com",
    password: "jessica123",
    role: "admin",
    status: "active",
    profileImage: "https://api.dicebear.com/7.x/adventurer/svg?seed=Jessica",
    phone: "+1 456 789 0123",
    gender: "female",
    dateOfBirth: "1982-08-24",
    address: "777 Admin Plaza, San Jose, CA",
    permissions: ["read", "write", "delete", "users"],
    lastLogin: "2023-10-25T08:00:00Z",
    createdAt: "02 Jul 2026",
    updatedAt: "25 Oct 2023",
  },
  {
    id: 11,
    username: "David Beckham",
    email: "david.b@example.com",
    password: "david123",
    role: "student",
    status: "blocked",
    profileImage: "https://api.dicebear.com/7.x/adventurer/svg?seed=David",
    phone: "+1 567 890 1234",
    gender: "male",
    dateOfBirth: "1998-04-11",
    address: "888 Penalty Ln, Austin, TX",
    permissions: [],
    lastLogin: "2023-07-22T12:15:00Z",
    createdAt: "18 Jul 2026",
    updatedAt: "22 Jul 2023",
  },
  {
    id: 12,
    username: "Marie Curie",
    email: "marie.c@example.com",
    password: "marie123",
    role: "instructor",
    status: "active",
    profileImage: "https://api.dicebear.com/7.x/adventurer/svg?seed=Marie",
    phone: "+1 678 901 2345",
    gender: "female",
    dateOfBirth: "1975-10-09",
    address: "999 Lab Dr, Jacksonville, FL",
    permissions: ["read", "write", "delete"],
    lastLogin: "2023-10-21T13:40:00Z",
    createdAt: "04 Aug 2026",
    updatedAt: "21 Oct 2023",
  },
  {
    id: 13,
    username: "Isaac Newton",
    email: "isaac.n@example.com",
    password: "isaac123",
    role: "admin",
    status: "active",
    profileImage: "https://api.dicebear.com/7.x/adventurer/svg?seed=Isaac",
    phone: "+1 789 012 3456",
    gender: "male",
    dateOfBirth: "1968-01-26",
    address: "111 Gravity St, Columbus, OH",
    permissions: ["read", "write", "delete", "users"],
    lastLogin: "2023-10-25T07:30:00Z",
    createdAt: "22 Aug 2026",
    updatedAt: "25 Oct 2023",
  },
  {
    id: 14,
    username: "Ada Lovelace",
    email: "ada.l@example.com",
    password: "ada123",
    role: "student",
    status: "active",
    profileImage: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ada",
    phone: "+1 890 123 4567",
    gender: "female",
    dateOfBirth: "2002-07-14",
    address: "222 Code Blvd, Charlotte, NC",
    permissions: ["read", "write"],
    lastLogin: "2023-10-24T18:20:00Z",
    createdAt: "10 Sep 2026",
    updatedAt: "24 Oct 2023",
  },
  {
    id: 15,
    username: "Nikola Tesla",
    email: "nikola.t@example.com",
    password: "nikola123",
    role: "instructor",
    status: "inactive",
    profileImage: "https://api.dicebear.com/7.x/adventurer/svg?seed=Nikola",
    phone: "+1 901 234 5678",
    gender: "male",
    dateOfBirth: "1970-11-30",
    address: "333 Volt Way, San Francisco, CA",
    permissions: ["read", "write"],
    lastLogin: "2023-06-05T10:10:00Z",
    createdAt: "28 Sep 2026",
    updatedAt: "05 Jun 2023",
  },
  {
    id: 16,
    username: "Grace Hopper",
    email: "grace.h@example.com",
    password: "grace123",
    role: "admin",
    status: "active",
    profileImage: "https://api.dicebear.com/7.x/adventurer/svg?seed=Grace",
    phone: "+1 012 345 6789",
    gender: "female",
    dateOfBirth: "1980-05-20",
    address: "444 Bug Ln, Indianapolis, IN",
    permissions: ["read", "write", "delete", "users"],
    lastLogin: "2023-10-25T09:00:00Z",
    createdAt: "15 Oct 2026",
    updatedAt: "25 Oct 2023",
  },
  {
    id: 17,
    username: "Alan Turing",
    email: "alan.t@example.com",
    password: "alan123",
    role: "student",
    status: "active",
    profileImage: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alan",
    phone: "+1 123 456 78901",
    gender: "male",
    dateOfBirth: "2003-09-12",
    address: "555 Machine Ave, Seattle, WA",
    permissions: ["read"],
    lastLogin: "2023-10-22T14:30:00Z",
    createdAt: "02 Nov 2026",
    updatedAt: "22 Oct 2023",
  },
  {
    id: 18,
    username: "Rosalind Franklin",
    email: "rosalind.f@example.com",
    password: "rosalind123",
    role: "instructor",
    status: "active",
    profileImage: "https://api.dicebear.com/7.x/adventurer/svg?seed=Rosalind",
    phone: "+1 234 567 89012",
    gender: "female",
    dateOfBirth: "1983-12-03",
    address: "666 DNA Dr, Denver, CO",
    permissions: ["read", "write", "delete"],
    lastLogin: "2023-10-23T11:15:00Z",
    createdAt: "19 Nov 2026",
    updatedAt: "23 Oct 2023",
  },
  {
    id: 19,
    username: "Linus Torvalds",
    email: "linus.t@example.com",
    password: "linus123",
    role: "student",
    status: "blocked",
    profileImage: "https://api.dicebear.com/7.x/adventurer/svg?seed=Linus",
    phone: "+1 345 678 90123",
    gender: "male",
    dateOfBirth: "1997-02-28",
    address: "777 Kernel Ct, Boston, MA",
    permissions: [],
    lastLogin: "2023-05-12T16:45:00Z",
    createdAt: "06 Dec 2026",
    updatedAt: "12 May 2023",
  },
  {
    id: 20,
    username: "Margaret Hamilton",
    email: "margaret.h@example.com",
    password: "margaret123",
    role: "admin",
    status: "active",
    profileImage: "https://api.dicebear.com/7.x/adventurer/svg?seed=Margaret",
    phone: "+1 456 789 01234",
    gender: "female",
    dateOfBirth: "1976-06-17",
    address: "888 Apollo St, Detroit, MI",
    permissions: ["read", "write", "delete", "users"],
    lastLogin: "2023-10-25T06:50:00Z",
    createdAt: "23 Dec 2026",
    updatedAt: "25 Oct 2023",
  },
];
// export interface PopularCourse {
//   id: number;
//   letter: string;
//   title: string;
//   coursesCount: string;
//   color: string;
// }

// export interface BestInstructor {
//   id: number;
//   name: string;
//   coursesCount: string;
//   avatar: string;
// }

// export interface UpcomingLesson {
//   id: number;
//   title: string;
//   instructor: string;
//   date: string;
//   color: string;
// }

// export interface Notice {
//   id: number;
//   title: string;
//   desc: string;
//   time: string;
//   color: string;
// }

// export const dbPopularCourses: PopularCourse[] = [
//   { id: 1, letter: 'U', title: 'UI/UX Design', coursesCount: '30+ Courses', color: '#eab308' },
//   { id: 2, letter: 'M', title: 'Marketing', coursesCount: '25+ Courses', color: '#ec4899' },
//   { id: 3, letter: 'W', title: 'Web Dev.', coursesCount: '30+ Courses', color: '#14b8a6' },
//   { id: 4, letter: 'M', title: 'Mathematics', coursesCount: '50+ Courses', color: '#3b82f6' }
// ];

// export const dbBestInstructors: BestInstructor[] = [
//   { id: 1, name: 'Nil Yeager', coursesCount: '5 Design Course', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' },
//   { id: 2, name: 'Theron Trump', coursesCount: '5 Design Course', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
//   { id: 3, name: 'Tyler Mark', coursesCount: '5 Design Course', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80' },
//   { id: 4, name: 'Johen Mark', coursesCount: '5 Design Course', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80' }
// ];

// export const dbUpcomingLessons: UpcomingLesson[] = [
//   { id: 1, title: 'Informatic Course', instructor: 'Nil Yeager', date: '19 April', color: '#eab308' },
//   { id: 2, title: 'Live Drawing', instructor: 'Micak Doe', date: '12 June', color: '#3b82f6' },
//   { id: 3, title: 'Contemporary Art', instructor: 'Potar doe', date: '27 July', color: '#ec4899' },
//   { id: 4, title: 'Live Drawing', instructor: 'Micak Doe', date: '12 June', color: '#a855f7' }
// ];

// export const dbNotices: Notice[] = [
//   { id: 1, title: 'New Teacher', desc: 'It is a long established fact that a reader will be...', time: 'Just Now', color: '#3b82f6' },
//   { id: 2, title: 'New Fees Structure', desc: 'It is a long established fact that a reader will be...', time: 'Today', color: '#ec4899' },
//   { id: 3, title: 'Updated Syllabus', desc: 'It is a long established fact that a reader will be...', time: '17 Dec 2020', color: '#14b8a6' },
//   { id: 4, title: 'New Course', desc: 'It is a long established fact that a reader will be...', time: '27 Oct 2020', color: '#a855f7' }
// ];

// export const dbSchoolPerformance = [
//   { name: 'Mauris dictum', value: 85, color: '#3b82f6' },
//   { name: 'Etiam vitae', value: 80, color: '#a855f7' },
//   { name: 'Praesent non', value: 78, color: '#14b8a6' },
//   { name: 'Duis eget', value: 58, color: '#ec4899' },
//   { name: 'Mauris et arcu', value: 35, color: '#eab308' }
// ];

