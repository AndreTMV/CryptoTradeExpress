from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from quiz import views

router = routers.DefaultRouter()
router.register(r'quiz', views.QuizView, 'quiz')
router.register(r'questions', views.QuestionView, 'questions')
router.register(r'answers', views.AnswerView, 'answers')
router.register(r'results', views.ResultView, 'results')
urlpatterns = [
    path("api/v1/", include(router.urls)),
    path('docs/Quiz/', include_docs_urls(title="Quiz Api")),
]
