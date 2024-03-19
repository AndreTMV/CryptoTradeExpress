from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import viewsets
from .serializer import PerfilSerializer 
from .models import Perfil
from rest_framework.permissions import AllowAny, IsAuthenticated
# Create your views here.
class PerfilView(viewsets.ModelViewSet):
    serializer_class = PerfilSerializer
    queryset = Perfil.objects.all()
    permission_classes = [IsAuthenticated]
