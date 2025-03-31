from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models import Count,F,Q,Value,OuterRef,Subquery
from django.forms.models import model_to_dict
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.

class Workout(models.Model):
    name = models.TextField(max_length = 40, blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    
    def __str__(self):
        return f"Workout: {self.name} made by {self.created_by.get_full_name()}"
    
    def get_default_dict(self):
        return {"id":self.id,"name":self.name,"exercises":[{"id":w.exercise.id,"sets":w.sets} for w in self.exercise_in_program_set.order_by("order").all()]}
    
    def get_muscles(self):
        return [muscle["name"] for muscle in Muscle_group.objects.filter(exercise__exercise_in_program__workout=self).distinct().values("name")]
    
class Muscle_group(models.Model):
    name = models.TextField(max_length=40)
    
    def __str__(self):
        return f"{self.name}"

class Exercise(models.Model):
    name = models.TextField(max_length = 40)
    muscle_group = models.ManyToManyField(Muscle_group)
    lower_reps = models.PositiveIntegerField()
    higher_reps = models.PositiveIntegerField()
    uses_bar = models.BooleanField(default=False)
    description = models.TextField(max_length=300, blank=True)

    def __str__(self):
        return f"Exercise: {self.name}"
    
class User_notes(models.Model):
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField(max_length=300, default="")

    def __str__(self):
        return f"{self.user.first_name} note on {self.exercise}"
    
class Exercise_in_program(models.Model):
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    order = models.DecimalField(max_digits=2, decimal_places=0)
    sets = models.PositiveIntegerField()

    def __str__(self):
        return f"Workout program #{self.id}: {self.exercise.name} "
    
    def completed_sets(self,session):
        return Session_workout.objects.filter(exercise=self.exercise,session=session).aggregate(count=Count("reps_and_weights",filter=Q(reps_and_weights__is_warmup=False)&Q(reps_and_weights__weight__gt=0)))["count"]
 
class Session(models.Model):
    workout_performed = models.ForeignKey(Workout, on_delete=models.SET_NULL, null=True, blank=True)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    finished = models.BooleanField(default=False)

    def next(self,exclude):
        print("-"*15)
        exercises = [int(each.order) for each in self.workout_performed.exercise_in_program_set.exclude(order=exclude).order_by("order").all() if each.sets > self.session_workout_set.filter(exercise_id=each.exercise_id).aggregate(count=Count("reps_and_weights",filter=Q(reps_and_weights__is_warmup=False)&Q(reps_and_weights__weight__gt=0)))["count"]]        
        return exercises

class Session_workout(models.Model):
    step = models.DecimalField(decimal_places=1, max_digits=3, blank=True, null=True)
    units_kg = models.BooleanField(blank=True, null=True)
    weight_per_side = models.BooleanField(blank=True, null=True)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, blank=True, null=True)
    session = models.ForeignKey(Session, on_delete=models.CASCADE, blank=True, null=True)

class Reps_and_weights(models.Model):
    weight = models.DecimalField(decimal_places=1, max_digits=4, blank=True, null=True)
    reps = models.PositiveSmallIntegerField(blank=True, null=True)
    set = models.PositiveSmallIntegerField()
    is_warmup = models.BooleanField(default=False)
    difficulty = models.DecimalField(decimal_places=0, max_digits=1, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    session_workout = models.ForeignKey(Session_workout, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.reps} of {self.session_workout.exercise.name} with {self.weight}"

class Workouts_in_plan(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    order = models.IntegerField(validators=[MaxValueValidator(10),MinValueValidator(1)])
    workout = models.ForeignKey(Workout,on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.workout.name}: Day {self.order} in {self.user.first_name}'s plan"
    
    @staticmethod
    def current_workout(user):
        workouts = Workouts_in_plan.objects.filter(user=user)
        last_rep_recorded = Reps_and_weights.objects.filter(session_workout__session__user=user,session_workout__session__workout_performed__in=[w.workout for w in workouts.all()]).order_by("-created_at").first()
        if not last_rep_recorded:
            return {"workout":workouts.order_by("order").first().workout}
        last_session = last_rep_recorded.session_workout.session
        workout = last_session.workout_performed
        print(model_to_dict(workout))
        if timezone.now() - last_rep_recorded.created_at > timezone.timedelta(hours=6):
            order = workouts.get(workout=workout).order
            match_order_workout = workouts.get(order=1 if order == workouts.count() else order+1)
            print(model_to_dict(match_order_workout))
            print()
            return {"workout":workouts.get(order=1 if order == workouts.count() else order+1).workout}
        return {"session":last_session,"workout":workout}


    
