import { PaginationOptions, PaginatedResult } from "../../models";

/**
 * Interface genérica para repositórios
 */
export interface IRepository<T, CreateDto, UpdateDto> {
    create(data: CreateDto): Promise<T>;
    findById(id: string): Promise<T | null>;
    update(id: string, data: UpdateDto): Promise<T>;
    delete(id: string): Promise<T>;
    findAll(options: PaginationOptions): Promise<PaginatedResult<T>>;
}

/**
 * Interface para o repositório de clientes
 */
export interface ICustomerRepository<T, CreateDto, UpdateDto>
    extends IRepository<T, CreateDto, UpdateDto> {
    findByEmail(email: string): Promise<T | null>;
    findByName(
        name: string,
        options: PaginationOptions,
    ): Promise<PaginatedResult<T>>;
}

/**
 * Interface para o repositório de produtos
 */
export interface IProductRepository<T, CreateDto, UpdateDto>
    extends IRepository<T, CreateDto, UpdateDto> {
    findByName(
        name: string,
        options: PaginationOptions,
    ): Promise<PaginatedResult<T>>;
    findByIds(ids: string[]): Promise<T[]>;
}

/**
 * Interface para o repositório de pedidos
 */
export interface IOrderRepository<T, CreateDto, UpdateDto, StatusEnum>
    extends IRepository<T, CreateDto, UpdateDto> {
    findByCustomer(
        customerId: string,
        options: PaginationOptions,
    ): Promise<PaginatedResult<T>>;
    findByStatus(
        status: StatusEnum,
        options: PaginationOptions,
    ): Promise<PaginatedResult<T>>;
    updateStatus(id: string, status: StatusEnum): Promise<T>;
}

/**
 * Interface para o repositório de pagamentos
 */
export interface IPaymentRepository<T, CreateDto, UpdateDto, StatusEnum>
    extends IRepository<T, CreateDto, UpdateDto> {
    findByExternalId(externalId: string): Promise<T | null>;
    findByOrder(orderId: string): Promise<T[]>;
    findByStatus(
        status: StatusEnum,
        options: PaginationOptions,
    ): Promise<PaginatedResult<T>>;
    updateStatus(id: string, status: StatusEnum): Promise<T>;
    markAsNotified(id: string): Promise<T>;
}
