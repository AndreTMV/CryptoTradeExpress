from datetime import datetime    
from django.db import models
from videos.models import Video
from login.models import User
from django.db.models.signals import post_save 
from django.dispatch import receiver

# Create your models here.
class Quiz(models.Model):
    STATUS_CHOICES = (
        ('aceptado', 'Aceptado'),
        ('pendiente', 'Pendiente'),
        ('rechazado', 'Rechazado'),
    )
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    status = models.CharField(max_length=9, choices=STATUS_CHOICES, default="pendiente")
    number_of_question = models.IntegerField()
    change_status_date = models.DateTimeField(default=datetime.now, blank=True)


    def __str__(self) -> str:
        return f"{self.title}" 

    def get_questions(self):
        return self.question_set.all()

    class Meta:
        verbose_name_plural = 'Quizes'
    
class Question(models.Model):
    QUESTION_TYPES = (
        ('multiple_choice', 'Opción Múltiple'),
        ('true_false', 'Verdadero/Falso'),
        ('fill_in_the_blank', 'Completar el Blanco'),
    )
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES)
    text = models.TextField(max_length=300)

    def __str__(self) -> str:
        return self.text

    def get_answers(self):
        return self.answer_set.all()

class Answer(models.Model):
    text = models.CharField(max_length=300)
    correct = models.BooleanField(default=False)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"question: {self.question.text} answer: {self.text} correct: {self.correct}" 

class Result(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    score = models.FloatField()

    def __str__(self):
        return self.pk

class Report(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=300)

    def __str__(self) -> str:
        return  f"quiz: {self.quiz} title: {self.title}" 

@receiver(post_save, sender=Report)
def update_date_status(sender, instance, *args, **kwargs):
    quiz_instance = instance.quiz 
    quiz_instance.change_status_date = datetime.now().isoformat()
    quiz_instance.status="pendiente"
    quiz_instance.save()