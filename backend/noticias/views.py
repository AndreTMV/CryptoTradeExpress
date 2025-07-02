from django.shortcuts import render
from django.db.models import Sum, F
from rest_framework import viewsets
from .models import Noticia, CryptosTrending
from .serializer import NoticiaSerializer, CryptosSerializer
from django.db.models.functions import Coalesce
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import requests
from datetime import datetime
from .models import Noticia, CryptosTrending
from rest_framework.response import Response
from datetime import datetime
from rest_framework import status
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer
import random
import nltk
nltk.download('vader_lexicon')
from nltk.sentiment.vader import SentimentIntensityAnalyzer
user = '/Users/andremejia/Library/Application Support/Google/Chrome/Default'
# Create your views here.

class NoticiaView(viewsets.ModelViewSet):
    serializer_class = NoticiaSerializer
    queryset = Noticia.objects.all()

class CryptoView(viewsets.ModelViewSet):
    serializer_class = CryptosSerializer 
    queryset = CryptosTrending.objects.all()



@api_view(['GET'])
def get_trending_cryptos(request):
    target_url = "https://coinmarketcap.com"

    # Iniciar el navegador Chrome con las opciones configuradas
    driver = webdriver.Chrome()

    # Cargar la pagina de CoinMarketCap
    driver.get(target_url)

    # Esperar 5 segundos para que la pagina cargue completamente
    time.sleep(2)
# ,"p.sc-4984dd93-0.kKpPOn"
    all_p_elements = driver.find_elements(By.CSS_SELECTOR, "p.sc-71024e3e-0.ehyBa-d")
    first_10_texts = [p_element.text for p_element in all_p_elements[12:-3]]
    num_cryptos_to_select = random.randrange(1, len(first_10_texts))

    selected_cryptos = random.sample(first_10_texts, num_cryptos_to_select)

    # Cerrar el navegador
    driver.quit()

    # Crear o actualizar el objeto CryptosTrending
    cryptos_trending, created = CryptosTrending.objects.get_or_create(
        date_fetched=datetime.now(),
        defaults={'cryptos': selected_cryptos}
    )

    if not created:
        cryptos_trending.cryptos = selected_cryptos
        cryptos_trending.date_fetched = datetime.now()
        cryptos_trending.save()

    return Response({'cryptos': selected_cryptos}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_news(request):
    today = datetime.now().date()
    # Obtener la lista de criptomonedas de la base de datos
    cryptos_trending_today = CryptosTrending.objects.filter(date_fetched__date = today)  # Suponiendo que solo hay un registro en la tabla
    if cryptos_trending_today.exists():
        for cryptos_trending in cryptos_trending_today:
            cryptos_today = cryptos_trending.cryptos
            print("Criptomonedas de hoy:", cryptos_today)
            # Realizar web scraping en la plataforma X
            for crypto in cryptos_today:
                # Realizar web scraping en la plataforma X
                target_url = f"https://twitter.com/i/flow/login?redirect_after_login=%2Fsearch%3Fq%3D%2523{crypto}%26src%3Dtyped_query%26f%3Dtop"
                user_name = 'Andre47428031'
                email = 'andretmv12345@gmail.com'
                password = 'Andreres123'
                #
                global user
                # Crear una instancia del controlador de Safari
                options = webdriver.ChromeOptions()
                options.add_argument(f"user-data-dir={user}")
                driver = webdriver.Chrome()

                # Cargar la pagina de Twitter
                driver.get(target_url)

                # Esperar 5 segundos para que la pagina cargue completamente
                time.sleep(4)

                email_input = driver.find_element(By.NAME, "text")
                email_input.send_keys(email)

                time.sleep(2)
                submit_button = driver.find_element(
                    By.XPATH, "//button[@class='css-175oi2r r-sdzlij r-1phboty r-rs99b7 r-lrvibr r-ywje51 r-184id4b r-13qz1uu r-2yi16 r-1qi8awa r-3pj75a r-1loqt21 r-o7ynqc r-6416eg r-1ny4l3l']")
                submit_button.click()

                time.sleep(2)
                try:

                    user_input = driver.find_element(By.NAME, "text")
                    user_input.send_keys(user_name)

                    time.sleep(2)

                    user_submit_button = driver.find_element(
                        By.XPATH, "//button[@class='css-175oi2r r-sdzlij r-1phboty r-rs99b7 r-lrvibr r-19yznuf r-64el8z r-1fkl15p r-1loqt21 r-o7ynqc r-6416eg r-1ny4l3l']")
                    user_submit_button.click()
                except:
                    print("No hay campo de usuario")

                time.sleep(2)

                password_input = driver.find_element(By.NAME, 'password')
                password_input.send_keys(password)

                time.sleep(2)

                login_button = driver.find_element(
                    By.XPATH, "//button[@class='css-175oi2r r-sdzlij r-1phboty r-rs99b7 r-lrvibr r-19yznuf r-64el8z r-1fkl15p r-1loqt21 r-o7ynqc r-6416eg r-1ny4l3l']")

                login_button.click()

                time.sleep(5)


                tweets_div = driver.find_elements(
                    By.XPATH, "//article[@data-testid='tweet']")
                for tweet in tweets_div:


                    span_username = tweet.find_element(
                        By.XPATH, ".//div[@class='css-146c3p1 r-dnmrzs r-1udh08x r-3s2u2q r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41 r-18u37iz r-1wvb978']//span[@class='css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3']")
                    date_field = tweet.find_element(
                        By.XPATH, ".//div[@class='css-175oi2r r-18u37iz r-1q142lx']//time")
                    date_time = date_field.get_attribute('datetime')
                    tweet_text = tweet.find_element(
                        By.XPATH, ".//div[@class='css-175oi2r r-eqz5dr r-16y2uox r-1wbh5a2']//div[@class='css-175oi2r r-16y2uox r-1wbh5a2 r-1ny4l3l']//div[@class='css-175oi2r r-1iusvr4 r-16y2uox r-1777fci r-kzbkwu']//div[@data-testid='tweetText']")
                    bottom_part = tweet.find_element(
                        By.XPATH, ".//div[@class='css-175oi2r r-eqz5dr r-16y2uox r-1wbh5a2']//div[@class='css-175oi2r r-16y2uox r-1wbh5a2 r-1ny4l3l']//div[@class='css-175oi2r r-1iusvr4 r-16y2uox r-1777fci r-kzbkwu']//div[@class='css-175oi2r r-1kbdv8c r-18u37iz r-1wtj0ep r-1ye8kvj r-1s2bzr4']")
                    reply = bottom_part.find_element(
                        By.XPATH, ".//button[@data-testid='reply']").get_attribute('aria-label')
                    retweet = bottom_part.find_element(
                        By.XPATH, ".//button[@data-testid='retweet']").get_attribute('aria-label')
                    likes = bottom_part.find_element(
                        By.XPATH, ".//button[@data-testid='like']").get_attribute('aria-label')
                    visualizations = bottom_part.find_element(
                        By.XPATH, ".//a[@class='css-175oi2r r-1777fci r-bt1l66 r-bztko3 r-lrvibr r-1ny4l3l r-1loqt21']").get_attribute('aria-label')

                    # Extraer solo el numero de cada texto
                    reply_number = ''.join(filter(str.isdigit, reply))
                    retweet_number = ''.join(filter(str.isdigit, retweet))
                    likes_number = ''.join(filter(str.isdigit, likes))
                    visualizations_number = ''.join(filter(str.isdigit, visualizations))

                    # checar si la noticia existe y despues guardar los tweets en la base de datos
                    existing_news = Noticia.objects.filter(
                        user=span_username.text,
                        date=date_time,
                        news=tweet_text.text,
                        likes=likes_number,
                        retweets=retweet_number,
                        comments=reply_number,
                        views=visualizations_number,
                        crypto=crypto
                    )

                    if not existing_news.exists():
                        new_tweet = Noticia.objects.create(
                            user=span_username.text,
                            date=date_time,
                            news=tweet_text.text,
                            likes=likes_number,
                            retweets=retweet_number,
                            comments=reply_number,
                            views=visualizations_number,
                            crypto=crypto
                        )
                        new_tweet.save()
    else:
        return Response({"message": "No hay datos de criptomonedas para hoy en la base de datos."}, status=status.HTTP_404_NOT_FOUND)
    return Response(200)

@api_view(['GET'])
def get_trending_news(request):
    today = datetime.now().date()

    # Obtener las criptomonedas trending de hoy
    cryptos_trending_today = CryptosTrending.objects.filter(date_fetched__date=today)

    if cryptos_trending_today.exists():
        trending_news = []

        sia = SentimentIntensityAnalyzer()

        # Iterar sobre cada criptomoneda trending
        for cryptos_trending in cryptos_trending_today:
            cryptos_today = cryptos_trending.cryptos

            # Iterar sobre cada criptomoneda para encontrar la noticia con más interacciones
            for crypto in cryptos_today:
                # Obtener todas las noticias de la criptomoneda para hoy
                news_for_crypto_today = Noticia.objects.filter(crypto=crypto, date_fetched=today)
                if news_for_crypto_today.exists():
                            # Obtener la noticia con más interacciones de esta criptomoneda para hoy
                            top_news_for_crypto = news_for_crypto_today.annotate(
                                total_interactions=Coalesce(Sum('likes'), 0) + Coalesce(Sum('retweets'), 0) + Coalesce(Sum('comments'), 0) + Coalesce(Sum('views'), 0)
                            ).order_by('-total_interactions').first()

                            if top_news_for_crypto is not None:
                                news_sentiment = sia.polarity_scores(top_news_for_crypto.news)
                                top_news_for_crypto.compound = news_sentiment['compound']
                                trending_news.append(top_news_for_crypto)
                                top_news_for_crypto.save()
         # Serializar y devolver la lista de noticias
        return Response(NoticiaSerializer(trending_news, many=True).data)
    else:
        return Response({"message": "No hay datos de criptomonedas trending para hoy en la base de datos."}, status=status.HTTP_404_NOT_FOUND)