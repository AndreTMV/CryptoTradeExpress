from django.shortcuts import render
from rest_framework import viewsets
from .models import Quiz, Question, Answer, Result
from .serializer import QuestionSerializer, QuizSerializer, AnswerSerializer, ResultSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view

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