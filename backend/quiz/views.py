from django.shortcuts import render
from rest_framework import viewsets
from .models import Quiz, Question, Answer, Result, Report
from .serializer import QuestionSerializer, QuizSerializer, AnswerSerializer, ResultSerializer, ReportSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
from datetime import datetime 
from .models import Quiz
from login.models import User

# Create your views here.

class QuizView(viewsets.ModelViewSet):
    serializer_class = QuizSerializer
    queryset = Quiz.objects.all()

class QuestionView(viewsets.ModelViewSet):
    serializer_class = QuestionSerializer
    queryset = Question.objects.all()

class AnswerView(viewsets.ModelViewSet):
    serializer_class = AnswerSerializer
    queryset = Answer.objects.all()

class ResultView(viewsets.ModelViewSet):
    serializer_class = ResultSerializer
    queryset = Result.objects.all()

class ReportView(viewsets.ModelViewSet):
    serializer_class = ReportSerializer
    queryset = Report.objects.all()

@api_view(['PUT'])
def increase_quiz_question(request):
    quiz_id = request.data.get('id')
    questions = request.data.get('questions')
    quiz = Quiz.objects.get(id=quiz_id)
    if quiz:
        try:
            quiz.number_of_question = questions 
            quiz.save()
            return Response({'status': 'success', 'message': 'Numero de preguntas actualizada'}, status=200)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    else:
        return Response({'status': 'error', 'message': 'Debes proporcionar un quiz valido'}, status=400)

@api_view(['GET'])
def render_quiz(request):
    quiz_id = request.query_params.get('id')
    quiz = Quiz.objects.get(id=quiz_id)
    if quiz:
        try:
            questions = []
            for question in quiz.get_questions() :
                answers = []
                for answer in question.get_answers() :
                    answers.append({'text': answer.text, 'correct': answer.correct})
                questions.append({'type': question.question_type, 'text': question.text, 'answers': answers})
            return Response({
                'title': quiz.title,
                'question':questions
            }, status=200)
        except Exception as e:
            return Response({'error':str(e)}, status=500)
    else:
        return Response({'status':'error', 'message':'Debes proporcionar un quiz valido'}, status=400)

@api_view(['GET'])
def get_quiz_video(request):
    video_id = request.query_params.get('id')
    quiz = Quiz.objects.get(video=video_id)
    return Response({'id':quiz.id}, status=200)

@api_view(['PUT'])
def accept_quiz(request):
    quiz_id = request.data.get('id')
    state = request.data.get('state')
    quiz = Quiz.objects.get(id=quiz_id)
    if quiz:
        try:
            quiz.status = state 
            quiz.save()
            return Response({'status': 'success', 'message': 'Quiz status changed'}, status=200)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    else:
        return Response({'status': 'error', 'message': 'Debes proporcionar un quiz valido'}, status=400)

@api_view(['PUT'])
def change_date_status(request):
    quiz_id = request.data.get('id')
    quiz = Quiz.object.get(id=quiz_id)
    if quiz:
        try:
            quiz.change_status_date = datetime.now
            quiz.save()
            return Response({'status': 'success', 'message': 'Quiz date status changed'}, status=200)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    else:
        return Response({'status': 'error', 'message': 'Debes proporcionar un quiz valido'}, status=400)       

@api_view(['GET'])
def get_user_reports(request):
    user_id = request.query_params.get('username')
    user = User.objects.get(username=user_id)
    if user:
        try:
            user_videos = user.video_set.all()
            user_quizzes = Quiz.objects.filter(video__in=user_videos)
            user_reports = Report.objects.filter(quiz__in=user_quizzes)
            serializer = ReportSerializer(user_reports, many=True)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    else:
        return Response({'status': 'error', 'message': 'Debes proporcionar un usuario valido'}, status=400) 

@api_view(['DELETE'])
def delete_all_questions(request):
    quiz_id = request.query_params.get('id')
    try:
        quiz = Quiz.objects.get(id=quiz_id)
        if quiz:
            questions = quiz.get_questions()
            for question in questions:
                question.delete()
            return Response({'status': 'success', 'message': 'Todas las preguntas del cuestionario han sido eliminadas'}, status=200)
        else:
            return Response({'status': 'error', 'message': 'El cuestionario no fue encontrado'}, status=404)
    except Quiz.DoesNotExist:
        return Response({'status': 'error', 'message': 'El cuestionario no existe'}, status=400)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
