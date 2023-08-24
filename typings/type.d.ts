interface ExceptionInstance {
    message: string;
    code: string;
    status: number;
    reason?: Record<string, unknown>;
    source: Array<string>;
}
