import { ReactNode } from "react";
type FallbackProps = {
  loadingFallback?: ReactNode;
  errorFallback?: ((error: any) => ReactNode) | ReactNode;
  emptyFallback?: ReactNode;
  isEmpty?: (data: any) => boolean;
};

type AsyncBoundaryProps<T> = FallbackProps & {
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  error?: any;
  data?: T;
  children: ReactNode | ((data: T) => ReactNode);
};

export function AsyncBoundary<T>({
  isLoading,
  isFetching,
  isError,
  error,
  data,
  children,
  loadingFallback = <DefaultLoading />,
  errorFallback = (err) => <DefaultError error={err} />,
  emptyFallback = <DefaultEmpty />,
  isEmpty,
}: AsyncBoundaryProps<T>) {
  const resolved =  {
    isLoading: isLoading || isFetching,
    isError,
    error,
    data,
  };

  if (resolved.isLoading) return loadingFallback;
  if (resolved.isError) {
    if (typeof errorFallback === "function") return (errorFallback as (error: any) => ReactNode)(resolved.error);
    return errorFallback;
  }
  // Lógica automática para listas vazias
  const isList = Array.isArray(resolved.data);
  if (
    (!resolved.data) ||
    (isList && (resolved.data as any[]).length === 0) ||
    (isEmpty && isEmpty(resolved.data))
  ) {
    return emptyFallback;
  }
  return typeof children === "function"
    ? (children as (data: T) => ReactNode)(resolved.data)
    : children;
}

function DefaultLoading() {
  return (
    <div className="flex items-center justify-center py-8">
      <span className="ml-2 text-gray-500">Carregando...</span>
    </div>
  );
}

function DefaultError({ error }: { error: any }) {
  return (
    <div className="flex items-center justify-center py-8 text-red-600">
      <span>Erro: {error?.message || "Ocorreu um erro."}</span>
    </div>
  );
}

function DefaultEmpty() {
  return (
    <div className="flex items-center justify-center py-8 text-gray-400">
      <span>Nenhum dado encontrado.</span>
    </div>
  );
}