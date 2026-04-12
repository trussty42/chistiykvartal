from django.db import models


class MeasureUnit(models.Model):
    name = models.CharField(max_length=20)

    class Meta:
        verbose_name = 'Единица измерения'
        verbose_name_plural = 'Единицы измерения'


class WasteType(models.Model):
    type_name = models.CharField(max_length=50)
    photo = models.ImageField(upload_to='waste_types/', blank=True, null=True)
    measure = models.ForeignKey(MeasureUnit, on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Тип отхода'
        verbose_name_plural = 'Типы отходов'
