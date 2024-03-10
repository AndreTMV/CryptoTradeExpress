from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import viewsets
from .serializer import VideoSerializer, SectionSerializer, Eliminated_VideoSerializer
from .models import Video, Section, Eliminated_Video

# Create your views here.
class VideoView(viewsets.ModelViewSet):
    serializer_class = VideoSerializer
    queryset = Video.objects.all()

class SectionView(viewsets.ModelViewSet):
    serializer_class = SectionSerializer
    queryset = Section.objects.all()

class Eliminated_VideoView(viewsets.ModelViewSet):
    serializer_class = Eliminated_VideoSerializer
    queryset = Eliminated_Video.objects.all()

@api_view(['GET'])
def get_section_videos(request):
    section_id = request.query_params.get('section')
    if section_id:
        try:
            videos = Video.objects.filter(section_id=section_id)
            serializer = VideoSerializer(videos, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    else:
        return Response({'error': 'Debes proporcionar una sección válida.'}, status=400)

@api_view(['GET'])
def get_videos_no_accepted(request):
    try:
        videos = Video.objects.filter(accepted=False)
        serializer = VideoSerializer(videos, many=True)
        return Response(serializer.data)
    except Exception as e:
            return Response({'error': str(e)}, status=500)

@api_view(['PUT'])
def increase_video_views(request):
    video_id = request.data.get('id')
    video = Video.objects.get(id=video_id)
    if video:
        try:
            video.views += 1
            video.save()
            return Response({'status': 'success', 'message': 'Vista aumentada correctamente'}, status=200)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    else:
        return Response({'status': 'error', 'message': 'Debes proporcionar un video valido'}, status=400)

@api_view(['PUT'])
def video_status(request):
    video_id = request.data.get('id')
    video = Video.objects.get(id=video_id)
    if video:
        try:
            video.accepted = True 
            video.save()
            return Response({'status': 'success', 'message': 'Video Aceptado'}, status=200)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    else:
        return Response({'status': 'error', 'message': 'Debes proporcionar un video valido'}, status=400)

@api_view(['PUT'])
def video_remove(request):
    video_id = request.data.get('id')
    video = Video.objects.get(id=video_id)
    if video:
        if video.views == 50 and ((video.stars / video.views) <= 7):
            try:
                video.accepted = False 
                video.save()
                return Response({'status': 'success', 'message': 'Video Aceptado'}, status=200)
            except Exception as e:
                return Response({'error': str(e)}, status=500)
    else:
        return Response({'status': 'error', 'message': 'Debes proporcionar un video valido'}, status=400)

@api_view(['PUT'])
def update_stars(request):
    video_id = request.data.get('id')
    star_amount = request.data.get('star')
    video = Video.objects.get(id=video_id)
    if video:
        try:
            video.stars += star_amount
            video.save()
            return Response({'status': 'success', 'message': 'Stars aumentada correctamente'}, status=200)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    else:
        return Response({'status': 'error', 'message': 'Debes proporcionar un video valido'}, status=400)

@api_view(['GET'])
def media_stars(request):
    video_id = request.query_params.get('id')
    video = Video.objects.get(id=video_id)
    if video:
        try:
            media = (video.stars / video.views)
            return Response({'status': 'success', 'media':media}, status=200)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    else:
        return Response({'status': 'error', 'message': 'Debes proporcionar un video valido'}, status=400)


@api_view(['GET'])
def check_video_exists(request):
    url = request.query_params.get('url')

    if url:
        video_exist = Video.objects.filter(url=url).exists()
        return Response({'exists': video_exist})

    return Response({'error': 'Debes proporcionar una url en los parámetros de consulta.'}, status=400)

@api_view(['GET'])
def check_video_eliminated_exists(request):
    url = request.query_params.get('url')

    if url:
        video_exist = Eliminated_Video.objects.filter(url=url).exists()
        return Response({'exists': video_exist})

    return Response({'error': 'Debes proporcionar una url en los parámetros de consulta.'}, status=400)