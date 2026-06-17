import type { ReactNode } from "react";

export type NavItem = {
    name: string;
    icon: ReactNode;
    path?: string;
    number?: number;
    children?: { name: string; path: string; pro?: boolean; new?: boolean; number?: number }[];
};

export type UserMenuItems =
    | { type: 'divider' }
    | { key: string; icon?: ReactNode; label?: string; danger?: boolean }