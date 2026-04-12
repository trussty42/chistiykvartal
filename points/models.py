from django.contrib.gis.db import models as gismodels
from django.contrib.postgres.indexes import GistIndex
from django.db import models

from users.models import Organization
from waste_types.models import WasteType


class PickUpPoint(models.Model):
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name='points'
    )
    adress = models.CharField(max_length=255, verbose_name='Адрес')
    location = gismodels.PointField(
        geography=True, srid=4326, verbose_name='Местоположение'
    )
    work_schedule = models.TextField(verbose_name='График работы')
    created_at = models.DateTimeField(
        auto_now_add=True, verbose_name='Создано'
    )
    visits_count = models.IntegerField(default=0, verbose_name='Посещений')
    average_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Рейтинг пункта'
    )
    is_moderated = models.BooleanField(
        default=False, verbose_name='Прошел модерацию'
    )
    moderation_status = models.CharField(
        max_length=20,
        choices=[
            ('new', 'Новый'),
            ('approved', 'Одобрено'),
            ('rejected', 'Отклонено')
        ],
        default='new',
        verbose_name='Статус'
    )

    class Meta:
        verbose_name = 'Пункт приема'
        verbose_name_plural = 'Пункты приема'
        indexes = [
            GistIndex(
                fields=['location'], name='point_location_idx'
            ),
        ]

    def __str__(self):
        return f'{self.organization.name} {self.adress}'


class PointWasteTypes(models.Model):
    point = models.ForeignKey(PickUpPoint, on_delete=models.CASCADE)
    waste_type = models.ForeignKey(WasteType, on_delete=models.CASCADE)
    price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, verbose_name='Цена'
    )
    is_actual_price = models.BooleanField(
        default=True, null=True, blank=True, verbose_name='Актуально'
    )

    class Meta:
        verbose_name = 'Приём отхода в пункте'
        verbose_name_plural = 'Приёмы отходов в пунктах'
        unique_together = ('point', 'waste_type')
