export interface ColumnType<T> {
    title?: any;
    dataIndex?: any;
    key?: any;

    sorter?: any;
    hidden?: boolean;

    render?: (value: any, record: T, index: number) => any;
    [key: string]: any;
}

export interface CommonTableProps<T> {
    columns: ColumnType<T>[];
    data: T[];

    loading?: boolean;

    // server pagination
    total?: number;
    current?: number;
    pageSize?: number;

    onTableChange?: (pagination: any, filters: any, sorter: any) => void;

    // search
    onSearch?: (value: string) => void;
    searchPlaceholder?: string;

    // add button
    onAdd?: () => void;

    // active switch
    isActive?: boolean;
    onActiveChange?: (val: boolean) => void;

    // export
    onExportAll?: () => Promise<T[]>;
    fileName?: string;
    title?: string;
    companyName?: string;
    email?: string;

    // summary
    summaryFields?: string[];
    scroll?: any;
}