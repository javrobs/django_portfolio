
from django.urls import path
from . import views
from . import login
from . import loaders
from . import workouts
from django.contrib import admin


urlpatterns = [
    path("",views.main),
    path("login/",views.main),
    path("signup/",views.main),
    path("workouts/",views.main),
    path("my-plan/",views.main),
    path("create-workout/",views.main),
    path("edit-workout/<int:workout_id>/",views.main),
    path('today/<int:order_id>', views.main),
    path('admin/', admin.site.urls),

    path("api/login/signup_user/",login.signup),
    path("api/login/login_user/",login.login_user),
    path("api/login/load_user/",login.load_user),
    path("api/login/logout_user/",login.logout_user),

    path("api/set_rep_weight/<int:order_id>/",workouts.reps_weights),
    path("api/create_workout/<int:workout_id>/",workouts.create_workout),
    path("api/create_workout/",workouts.create_workout),
    path("api/edit_workouts/<int:workout_id>/",workouts.edit_workouts),
    
    path("api/load/home/",loaders.home),
    path("api/load/workouts/",loaders.workouts),
    path("api/load/workout_details/<int:workout_id>/",loaders.workout_details),
    path("api/load/create_workout/",loaders.create_workout),
    path("api/load/create_workout/<int:workout_id>/",loaders.create_workout),
    path("api/load/today/<int:order_id>",loaders.reps_weights),
]
