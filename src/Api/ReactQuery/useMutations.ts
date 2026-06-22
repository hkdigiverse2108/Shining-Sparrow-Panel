import { useMutation, useQueryClient, type InvalidateQueryFilters, type QueryKey, type UseMutationOptions } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../Store/hooks";
import { HTTP_STATUS, ROUTES } from "../../Constants";
import type { CombinedErrorResponse } from "../../Types";
import { setSignOut } from "../../Store/Slices/AuthSlice";
import { showNotification } from "@/Attribute";

export function useMutations<TInput, TResponse>(
  mutationKey: QueryKey,
  callback: (input: TInput) => Promise<TResponse>,
  options?: UseMutationOptions<TResponse, CombinedErrorResponse, TInput>
) {
  const q = useQueryClient();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation<TResponse, CombinedErrorResponse, TInput>({
    mutationKey,
    mutationFn: callback,
    ...options,
    onSuccess: (data, variables, context, mutationContext) => {
      for (let i = 1; i < mutationKey.length; i++) {
        q.invalidateQueries({ queryKey: [mutationKey[i]] } as InvalidateQueryFilters);
      }
      options?.onSuccess?.(data, variables, context, mutationContext);
    },
    onError: (error: CombinedErrorResponse) => {
      switch (error.status) {
        case HTTP_STATUS.UNAUTHORIZED:
          dispatch(setSignOut());
          navigate(ROUTES.AUTH.LOGIN + `?returnUrl=${window.location.pathname}`, {
            replace: true,
          });
          break;
        default: {
          const message =
            (error as any)?.response?.data?.message ||
            (error as any)?.message ||
            "An error occurred";
          showNotification("error", message);
          break;
        }
      }
    },
  });
}