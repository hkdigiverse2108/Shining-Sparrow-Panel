export * from "@/Utils/Hooks";
export * from "@/Utils/ValidationSchemas";

export const Stringify = (value: object): string => {
    try {
        return JSON.stringify(value);
    } catch {
        return "";
    }
};

export const Storage = localStorage;