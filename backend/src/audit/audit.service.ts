import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditSettingsEntity } from './audit-settings.entity';
import { AuditLogEntity } from './audit-log.entity';
import { UpdateAuditSettingsDto } from './dto/update-audit-settings.dto';

export interface AuditLogCreateInput {
  userId?: string | null;
  userEmail?: string | null;
  userNombre?: string | null;
  roleId?: string | null;
  moduleRuta: string;
  moduleNombre?: string | null;
  actionType: string;
  method: string;
  endpoint: string;
  statusCode: number;
  ipAddress?: string | null;
  userAgent?: string | null;
  queryData?: string | null;
  bodyData?: string | null;
  note?: string | null;
}

export interface PaginatedAuditLogs {
  items: AuditLogEntity[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditSettingsEntity)
    private readonly settingsRepo: Repository<AuditSettingsEntity>,
    @InjectRepository(AuditLogEntity)
    private readonly logRepo: Repository<AuditLogEntity>,
  ) {}

  async getSettings(): Promise<AuditSettingsEntity> {
    const existing = await this.settingsRepo.findOne({ where: {} });
    if (existing) return existing;

    const settings = this.settingsRepo.create({
      debugModeEnabled: false,
      trackReadQueries: false,
    });
    return this.settingsRepo.save(settings);
  }

  async updateSettings(dto: UpdateAuditSettingsDto): Promise<AuditSettingsEntity> {
    const settings = await this.getSettings();
    Object.assign(settings, dto);
    return this.settingsRepo.save(settings);
  }

  async shouldLogRequest(method: string): Promise<boolean> {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) return true;

    if (method === 'GET') {
      const settings = await this.getSettings();
      return settings.trackReadQueries || settings.debugModeEnabled;
    }

    return false;
  }

  async isDebugEnabled(): Promise<boolean> {
    const settings = await this.getSettings();
    return settings.debugModeEnabled;
  }

  async createLog(input: AuditLogCreateInput): Promise<void> {
    const entity = this.logRepo.create({
      userId: input.userId ?? null,
      userEmail: input.userEmail ?? null,
      userNombre: input.userNombre ?? null,
      roleId: input.roleId ?? null,
      moduleRuta: input.moduleRuta,
      moduleNombre: input.moduleNombre ?? null,
      actionType: input.actionType,
      method: input.method,
      endpoint: input.endpoint,
      statusCode: input.statusCode,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
      queryData: input.queryData ?? null,
      bodyData: input.bodyData ?? null,
      note: input.note ?? null,
    });

    await this.logRepo.save(entity);
  }

  async getLogs(params: {
    userId?: string;
    moduleRuta?: string;
    method?: string;
    actionType?: string;
    from?: string;
    to?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedAuditLogs> {
    const qb = this.logRepo.createQueryBuilder('l').orderBy('l.createdAt', 'DESC');

    if (params.userId) {
      qb.andWhere('l.userId = :userId', { userId: params.userId });
    }

    if (params.moduleRuta) {
      qb.andWhere('l.moduleRuta LIKE :moduleRuta', { moduleRuta: `%${params.moduleRuta}%` });
    }

    if (params.method) {
      qb.andWhere('l.method = :method', { method: params.method.toUpperCase() });
    }

    if (params.actionType) {
      qb.andWhere('l.actionType LIKE :actionType', { actionType: `%${params.actionType}%` });
    }

    if (params.from) {
      qb.andWhere('l.createdAt >= :from', { from: params.from });
    }

    if (params.to) {
      qb.andWhere('l.createdAt <= :to', { to: params.to });
    }

    const pageSize = Math.min(Math.max(params.pageSize ?? 50, 1), 200);
    const page = Math.max(params.page ?? 1, 1);
    const skip = (page - 1) * pageSize;
    qb.skip(skip).take(pageSize);

    const [items, total] = await qb.getManyAndCount();
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
    };
  }
}
