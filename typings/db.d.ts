type UserStatus = 'active' | 'lock'
type UserType = 'admin' | 'user'

interface UserModel {
    _id: string
    name: string
    phone?: { number: string, verify: boolean }
    email?: { address: string, verify: boolean }
    password?: { bcrypt: string, algorithm: 'sha-256' | 'sha-1', updateAt: Date, wrongTimes?: number, unLockAt?: Date }
    type: Array<UserType>
    role?: Array<string>
    avatar?: { url: string, updateAt: Date }
    status: UserStatus
    lastLogin?: Date
    firstLogin?: Date
    createdAt: Date
    updatedAt: Date
}

interface UserTokenModel {
    _id: string
    userId: string
    hashedToken: string
    createdAt: Date
    updatedAt: Date
}

interface RoleModel {
    _id: string
    name: string
    permission: Record<string, Array<string>>
    type: 'inner-admin' | 'customer'
    createdAt: Date
    updatedAt: Date
}
