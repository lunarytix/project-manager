export interface AuditSettings {
  id: string;
  debugModeEnabled: boolean;
  trackReadQueries: boolean;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string | null;
  userEmail: string | null;
  userNombre: string | null;
  roleId: string | null;
  moduleRuta: string;
  moduleNombre: string | null;
  actionType: string;
  method: string;
  endpoint: string;
  statusCode: number;
  ipAddress: string | null;
  userAgent: string | null;
  queryData: string | null;
  bodyData: string | null;
  note: string | null;
  createdAt: string;
}

export interface AuditLogsResponse {
  items: AuditLog[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AuditLogFilters {
  userId?: string;
  moduleRuta?: string;
  method?: string;
  actionType?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}
