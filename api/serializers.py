import re

from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from api.service import validate_inn_by_api
from config.constants import NAME_PATTERN
from users.models import Organization, User


def get_user(username, email):
    filters = {}
    if username:
        filters['username'] = username
    if email:
        filters['email'] = email
    user = User.objects.filter(**filters).first()
    return user


class UserRegistrationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        required=True, allow_blank=False, max_length=150
    )
    email = serializers.EmailField(
        required=True, allow_blank=False, max_length=254
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        allow_blank=False,
        validators=(validate_password,)
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        allow_blank=False
    )

    class Meta:
        fields = (
            'username',
            'email',
            'password',
            'password_confirm'
        )
        model = User

    def validate(self, data):
        if data['password_confirm'] != data['password']:
            return serializers.ValidationError('Пароли не совпадают')
        return data

    def validate_username(self, value):
        if not re.fullmatch(NAME_PATTERN, value):
            raise serializers.ValidationError(
                'Введенное имя некорректно'
            )
        return value


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True, allow_blank=False)
    password = serializers.CharField(
        write_only=True, required=True, allow_blank=False
    )


class OrganizationSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        fields = (
            'user',
            'name',
            'inn',
            'email',
        )
        model = Organization

    def validate(self, data):
        if (self.context['request'].method == 'POST'
                and self.user.has_organization):
            raise serializers.ValidationError(
                'Вы не можете состоять сразу в нескольких организациях'
            )
        return data

    def validate_name(self, value):
        if not re.fullmatch(NAME_PATTERN, value):
            raise serializers.ValidationError(
                'Введенное имя некорректно'
            )
        return value

    def validate_inn(self, value):
        organization_by_inn = Organization.objects.filter(inn=value).first()
        if organization_by_inn:
            raise serializers.ValidationError(
                'Организация с таким ИНН уже существует'
            )
        if not validate_inn_by_api(value):
            raise serializers.ValidationError(
                'Компания по данному ИНН не найдена'
            )
        return value

    def validate_email(self, value):
        organization_by_email = Organization.objects.filter(
            email=value
        ).first()
        if organization_by_email:
            raise serializers.ValidationError(
                'Организация с таким email уже существует'
            )


class PointSerializer(serializers.ModelSerializer):
    pass
