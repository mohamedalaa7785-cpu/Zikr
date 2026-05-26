export interface ServiceErrorShape {
  message: string;
  status?: number;
  code?: string;
  cause?: unknown;
}

export class ServiceError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly cause?: unknown;

  constructor({ message, status, code, cause }: ServiceErrorShape) {
    super(message);
    this.name = 'ServiceError';
    this.status = status;
    this.code = code;
    this.cause = cause;
  }
}

export interface ApiFetchConfig {
  timeoutMs?: number;
  nextRevalidate?: number;
  tags?: string[];
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

export interface SearchResult<TType extends string, TData> {
  type: TType;
  id: string;
  title: string;
  description?: string;
  data: TData;
}
