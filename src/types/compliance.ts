// Compliance API types based on backend structure

export interface ComplianceAssessment {
  id: string;
  title: string;
  details?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ComplianceViolation {
  id: string;
  title?: string;
  code?: string;
  summary?: string;
  description?: string;
}

export interface ComplianceRequirement {
  id: string;
  title?: string;
  name?: string;
  summary?: string;
  description?: string;
}

export interface ComplianceReport {
  id: string;
  title?: string;
  summary?: string;
  details?: Record<string, unknown>;
}

// Proxy response wrapper - success
export interface ProxySuccessResponse<T = unknown> {
  ok: true;
  status: number;
  data: T;
}

// Proxy response wrapper - error
export interface ProxyErrorResponse {
  ok: false;
  status: number;
  error: {
    message: string;
  };
}

export type ProxyResponse<T = unknown> = ProxySuccessResponse<T> | ProxyErrorResponse;

// Type guard for success response
export function isProxySuccess<T>(resp: ProxyResponse<T>): resp is ProxySuccessResponse<T> {
  return resp.ok === true;
}

// Type guard for error response
export function isProxyError(resp: ProxyResponse): resp is ProxyErrorResponse {
  return resp.ok === false;
}

// Paginated list response
export interface PaginatedResponse<T> {
  results: T[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}
