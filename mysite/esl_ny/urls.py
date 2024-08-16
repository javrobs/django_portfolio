from django.urls import path
from . import views


app_name = "esl_ny"
urlpatterns = [
    path('',views.main,name='esl_ny')
]