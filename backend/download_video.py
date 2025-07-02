import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import requests

target_url = "https://coinmarketcap.com"

# Iniciar el navegador Chrome con las opciones configuradas
driver = webdriver.Chrome()

# Cargar la pagina de CoinMarketCap
driver.get(target_url)

# Esperar 5 segundos para que la pagina cargue completamente
time.sleep(2)