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

