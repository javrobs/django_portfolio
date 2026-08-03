from django.urls import path
from . import views


app_name = "tester"
urlpatterns = [
    path('',views.main),
    path('print',views.main),

    # GET calls
    path('QR/<int:loc>/<int:qr>',views.main),
    path('api/QR/<int:loc>/<int:qr>',views.api_QR),
    path('api/QR/<int:loc>/<int:qr>/<int:actor>/<str:action>',views.api_validate_QR),
    path('api/clients/',views.api_clients),
    path('api/parts/<int:client_id>/',views.api_parts),
    path('api/work_orders/<int:station_id>/',views.api_work_orders),

    # POST calls
    path('api/submit_new_po/<int:role>/',views.api_submit_new_po),
    path('api/enter_station/<int:role>/',views.api_enter_station),
    path('api/exit_wo/<int:role>/',views.api_exit_wo),
    path('api/finish/<int:role>/',views.api_finish),
    
]