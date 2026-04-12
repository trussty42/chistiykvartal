import re

from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

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
        pattern = r'^[\w.@+-]+\Z'
        if not re.fullmatch(pattern, value):
            raise serializers.ValidationError(
                'Введенное имя некорректно'
            )
        return value


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True, allow_blank=False)
    password = serializers.CharField(
        write_only=True, required=True, allow_blank=False
    )


class OrganizationRegistrationSerializer(serializers.ModelSerializer):

    class Meta:
        fields = (
            'name',
            'inn',
            'phone',
            'email',
        )
        model = Organization

    def create(self, validated_data):
        return super().create(validated_data)
