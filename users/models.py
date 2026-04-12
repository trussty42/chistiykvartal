from django.contrib.auth.models import AbstractUser
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField

USER = 'user'
COMPANY_EMPLOYEE = 'employee'
COMPANY_LEADER = 'leader'
MODERATOR = 'moderator'
ADMIN = 'admin'


ROLE_CHOICES = {
    USER: 'Пользователь',
    COMPANY_EMPLOYEE: 'Работник',
    COMPANY_LEADER: 'Директор',
    MODERATOR: 'Модератор',
    ADMIN: 'Администратор'
}


class User(AbstractUser):
    email = models.EmailField(verbose_name='Почта')
    first_name = models.CharField(
        max_length=50, blank=True, null=True, verbose_name='Имя'
    )
    middle_name = models.CharField(
        max_length=50, blank=True, null=True, verbose_name='Отчество'
    )
    last_name = models.CharField(
        max_length=50, blank=True, null=True, verbose_name='Фамилия'
    )
    phone = PhoneNumberField(verbose_name='Номер телефона')
    avatar = models.ImageField(
        upload_to='avatars/', blank=True, null=True, verbose_name='Аватар'
    )
    city = models.CharField(
        max_length=50, blank=True, null=True, verbose_name='Город'
    )
    created_at = models.DateTimeField(
        auto_now_add=True, verbose_name='Зарегистрирован'
    )
    points_visited_count = models.IntegerField(
        default=0,
        verbose_name='Всего посещено пунктов'
    )
    role = models.CharField('Роль', choices=ROLE_CHOICES, null=True, blank=True)

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        constraints = (
            models.UniqueConstraint(
                fields=('email',),
                name='unique_email'
            ),
        )

    def __str__(self):
        return self.username


class Organization(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=255, verbose_name='Название')
    inn = models.CharField(max_length=12, verbose_name='ИНН')
    phone = PhoneNumberField(verbose_name='Номер телефона')
    email = models.EmailField(verbose_name='Почта')
    logo = models.ImageField(
        upload_to='organizations/', verbose_name='Логотип'
    )
    website_url = models.URLField(verbose_name='Адрес сайта')
    rating_score = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Рейтинг компании'
    )
    total_reviews_count = models.IntegerField(
        default=0, verbose_name='Количество отзывов'
    )
    created_at = models.DateTimeField(
        auto_now_add=True, verbose_name='Дата регистрации'
    )
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'На проверке'),
            ('active', 'Активна'),
            ('blocked', 'Заблокирована')
        ],
        default='pending',
        verbose_name='Статус'
    )

    class Meta:
        verbose_name = 'Организация'
        verbose_name_plural = 'Организации'

    def __str__(self):
        return f'{self.name}'
