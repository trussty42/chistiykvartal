from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from django.db import transaction
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.viewsets import ModelViewSet
from rest_framework. permissions import IsAuthenticatedOrReadOnly

from api.serializers import (OrganizationSerializer,
                             UserLoginSerializer, UserRegistrationSerializer)
from config.constants import COMPANY_LEADER
from api.service import has_organization_rights
from users.models import Employee, Organization, User


@api_view(['POST'])
def user_registration(request):
    serializer = UserRegistrationSerializer(data=request.data)

    serializer.is_valid(raise_exception=True)
    serializer.validated_data.pop('password_confirm')
    username = serializer.validated_data['username']
    email = serializer.validated_data['email']
    password = serializer.validated_data['password']
    User.objects.create_user(
        username=username,
        email=email,
        password=password
    )
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def user_login(request):
    serializer = UserLoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    username = serializer.validated_data['username']
    password = serializer.validated_data['password']
    user = authenticate(username=username, password=password)

    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)

    return Response(
        {'error': 'Неверный логин или пароль'},
        status=status.HTTP_400_BAD_REQUEST
    )


class OrganizationViewSet(ModelViewSet):

    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)
    http_method_names = ['post', 'get', 'patch', 'head', 'options', 'delete']

    def perform_create(self, serializer):
        with transaction.atomic():
            organization = serializer.save(user=self.request.user)
            Employee.objects.create(
                user=self.request.user,
                organization=organization,
                role_in_organization=COMPANY_LEADER
            )

    def perform_update(self, serializer):
        if has_organization_rights(self.request.user, serializer.instance.pk):
            return super().perform_update(serializer)
        raise ValidationError('У вас нет прав на это действие')

    def perform_destroy(self, instance):
        if has_organization_rights(self.request.user, instance.pk):
            return super().perform_destroy(instance)
        raise ValidationError('У вас нет прав на это действие')
