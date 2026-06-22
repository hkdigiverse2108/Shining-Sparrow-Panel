import type { UseQueryOptions } from "@tanstack/react-query";

export type ResponseParserWrapper<T> = {
  data: T;
  status: number;
};

export interface Message {
  code: string;
  message: string;
  values: string[];
}

export type DefaultErrorResponse = ResponseParserWrapper<Message[]>;

export type FormErrorResponse = ResponseParserWrapper<Record<string, { code: string; values: string[] }[]>>;

export type CombinedErrorResponse = DefaultErrorResponse | FormErrorResponse;

export type AppQueryOptions<T> = Omit<UseQueryOptions<T, CombinedErrorResponse, T, any[]>, "queryKey" | "queryFn">;
