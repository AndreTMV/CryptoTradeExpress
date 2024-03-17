from celery import shared_task
from datetime import timedelta
from django.utils import timezone
from .models import Quiz

@shared_task
def auto_reject_quiz():
    # Obtener todos los quizzes que están pendientes y cuya fecha de cambio de estado sea hace más de 5 días
    quizzes_to_reject = Quiz.objects.filter(status='pendiente', change_status_date__lte=timezone.now() - timedelta(days=5))
    
    # Actualizar el estado de los quizzes a "rechazado"
    for quiz in quizzes_to_reject:
        quiz.status = 'rechazado'
        quiz.save()
