NAME_PATTERN = r'^[\w.@+-]+\Z'

USER = 'user'
COMPANY_EMPLOYEE = 'employee'
COMPANY_LEADER = 'leader'
MODERATOR = 'moderator'
ADMIN = 'admin'

ROLE_CHOICES = {
    USER: 'Пользователь',
    MODERATOR: 'Модератор',
    ADMIN: 'Администратор'
}

ORGANIZATION_CHOICES = {
    COMPANY_EMPLOYEE: 'Работник',
    COMPANY_LEADER: 'Директор',
}

HAS_ORGANIZATION_RIGHTS = [
    MODERATOR,
    ADMIN
]

ORGANIZATION_STATUSES = [
    ('pending', 'На проверке'),
    ('active', 'Активна'),
    ('blocked', 'Заблокирована')
]
