interface ExceptionInstance {
    message: string;
    code: string;
    status: number;
    reason?: Record<string, unknown>;
    source: Array<string>;
}

interface LoginResult {
    token: string
    user: {
        id: string
        name: string
        phone: { number?: string, verify?: boolean }
        email: { address?: string, verify?: boolean }
        avatar?: { url: string, updateAt: Date }
        type: Array<UserType>
        role: Array<string>
    }
}
