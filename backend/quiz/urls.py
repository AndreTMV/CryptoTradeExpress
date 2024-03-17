from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from quiz import views

router = routers.DefaultRouter()
router.register(r'quiz', views.QuizView, 'quiz')
router.register(r'questions', views.QuestionView, 'questions')
router.register(r'answers', views.AnswerView, 'answers')
router.register(r'results', views.ResultView, 'results')
router.register(r'report', views.ReportView, 'report')
urlpatterns = [
    path("api/v1/", include(router.urls)),
    path('docs/Quiz/', include_docs_urls(title="Quiz Api")),
    path("api/v1/increaseQuestions/", views.increase_quiz_question),
    path("api/v1/renderQuiz/", views.render_quiz),
    path("api/v1/getQuiz/", views.get_quiz_video),
    path("api/v1/quizStatus/", views.accept_quiz),
    path("api/v1/userReports/", views.get_user_reports),
    path("api/v1/deleteQuestions/", views.delete_all_questions),
]
