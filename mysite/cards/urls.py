from django.urls import path
from . import views


urlpatterns = [
    path('', views.main),
    path('tag/<int:tag_id>/', views.main),
    path('new/<int:amount>/', views.main),
    path('known/<int:amount>/', views.main),
    path('match/<int:amount>/', views.main),
    path('annotate/<int:amount>/', views.main),
    path('create_new/', views.main),
    
    path('api/load/home/', views.home_load),
    path('api/load/tag/<int:tag_id>', views.tag_load),
    path('api/load/new/<int:amount>', views.new_load),
    path('api/load/known/<int:amount>', views.known_load),
    path('api/load/annotate/<int:amount>', views.annotate),
    path('api/load/create_new/', views.create_new_load),

    path('api/study_word/',views.study_word),
    path('api/send_related_words/',views.send_related_words),
    path('api/save_user_notes/',views.save_user_notes),
    path('api/create_new_card/',views.create_new_card),
]