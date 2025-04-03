from django.contrib import admin
from .models import *
# Register your models here.

class MuscleGroupAdmin(admin.ModelAdmin):
    list_display = ["name"]

class WorkoutsInPlanAdmin(admin.ModelAdmin):
    list_display = ['id','order','workout',"user"]


class RepsAdmin(admin.ModelAdmin):
    list_display = ["id","created_at","session_workout","weight","reps","set", "is_warmup","difficulty"]

class SessionWorkoutAdmin(admin.ModelAdmin):
    list_display = ["id","session","exercise","step","units_kg","weight_per_side"]

class SessionAdmin(admin.ModelAdmin):
    list_display = ["id","created_at","user",'workout_performed',"finished"]

class ExerciseInProgramAdmin(admin.ModelAdmin):
    list_display = ['workout','order','sets']

class ExerciseAdmin(admin.ModelAdmin):
    list_display = ['name','lower_reps','higher_reps','uses_bar']
  
admin.site.register(Workout,)
admin.site.register(Muscle_group,MuscleGroupAdmin)
admin.site.register(Exercise,ExerciseAdmin)
admin.site.register(Exercise_in_program,ExerciseInProgramAdmin)
admin.site.register(Reps_and_weights,RepsAdmin)
admin.site.register(Session,SessionAdmin)
admin.site.register(Workouts_in_plan,WorkoutsInPlanAdmin)
admin.site.register(Session_workout,SessionWorkoutAdmin)
admin.site.register(User_notes)
