from django.urls import path
from . import views


app_name = "esl_ny"
urlpatterns = [
    path('',views.main,name='esl_ny'),
    path('communities_all/',views.communities,name='communities_api'),
    path('communities/<int:language>/',views.communities_language,name='communities_one_api'),
    path('populations_all/',views.population,name='population_api'),
    path('populations/<int:language>/',views.population_language,name='population_one_api'),
    path('demographic_all/',views.demographic,name='demographic_api'),
    path('demographic/<int:language>/',views.demographic,name='demographic_one_api'),
]


# @app.route("/")
# def home():
#     return "To website:<br>\
#             <a href='http://127.0.0.1:5000/endpoint'>New York City LEP Speakers</a><br><br>\
#             These are the possible routes for our API:<br>\
#             <a href='http://127.0.0.1:5000/communities_all'>/communities_all</a><br>\
#             <a href='http://127.0.0.1:5000/communities/Spanish'>/communities/Spanish</a> (Ex. Spanish)<br>\
#             <a href='http://127.0.0.1:5000/populations_all'>/populations_all</a><br>\
#             <a href='http://127.0.0.1:5000/populations/Spanish'>/populations/language </a> (Ex. Spanish)<br>\
#             <a href='http://127.0.0.1:5000/demographic_all'>/demographic_all</a><br>\
#             <a href='http://127.0.0.1:5000/demographic/Spanish'>/demographic/language </a> (Ex. Spanish)<br>"
          