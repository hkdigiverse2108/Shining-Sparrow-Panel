import { STORAGE_KEYS } from "@/Constants";
import type { Params } from "@/Types";

export const Stringify = (value: object): string => {
    try {
        return JSON.stringify(value);
    } catch {
        return "";
    }
};

export const Storage = localStorage;


export const getToken = () => {
    const token = Storage.getItem(STORAGE_KEYS.TOKEN);
    return token;
};

export const CleanParams = (params?: Params): Params | undefined => {
    if (!params) return undefined;

    return Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ""));
};

export const GenerateOptions = (data?: { _id: string; name?: string; firstName?: string; lastName?: string; title?: string; fullName?: string; orderNo?: string | null; estimateNo?: string | null }[]) => {
    if (!data || !Array.isArray(data)) return [];

    return data.map((item) => {
        const label = item.name?.trim() || [item.firstName, item.lastName].filter(Boolean).join(" ") || item.title?.trim() || item.fullName?.trim() || item.orderNo?.trim() || item.estimateNo?.trim() || "Unnamed";

        return {
            value: item._id,
            label,
        };
    });
};


export * from "@/Utils/Hooks";
export * from "@/Utils/ValidationSchemas";
export { extractArray } from "@/Utils/extractArray";