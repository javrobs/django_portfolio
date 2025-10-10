from django.urls import path
from . import views


app_name = "esl_ny"
urlpatterns = [
    path('',views.main,name='esl_ny'),
    path('communities_all/',views.communities,name='communities_api'),
    path('communities/<int:language>/',views.communities,name='communities_one_api'),
    path('populations_all/',views.population,name='population_api'),
    path('populations/<int:language>/',views.population_language,name='population_one_api'),
    path('demographic_all/',views.demographic,name='demographic_api'),
    path('demographic/<int:language>/',views.demographic,name='demographic_one_api'),
    path('geojson',views.geojson,name='geo'),
    path('data/',views.all_data,name='data_api'),
    path('data/<int:language>/',views.all_data,name='data_one_api'),
]
