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
        
        return (Session_workout.objects
                .filter(exercise=self.exercise,session=session)
                .aggregate(
                    count=Count("reps_and_weights",
                        filter=Q(reps_and_weights__is_warmup = False) & Q(reps_and_weights__weight__gt = 0))
                )["count"] if session else 00)
 
class Session(models.Model):
    workout_performed = models.ForeignKey(Workout, on_delete=models.SET_NULL, null=True, blank=True)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    finished = models.BooleanField(default=False)

    @staticmethod
    def current_session(user):
        six_hours_ago = timezone.now()-timezone.timedelta(hours=6)
        return Session.objects.annotate(sets_count=Count("session_workout__reps_and_weights")).filter(Q(session_workout__reps_and_weights__created_at__gt = six_hours_ago)|(Q(sets_count=0)&Q(created_at__gt = six_hours_ago)),user=user,finished=False).order_by("-created_at").first()
        
    def next(self,exclude):
        exercises = [int(each.order) for 
                     each in self.workout_performed.exercise_in_program_set.exclude(order = exclude).order_by("order").all() 
                     if each.sets > 
                        (self.session_workout_set
                            .filter(exercise_id = each.exercise_id)
                            .aggregate(
                            count=Count(
                                "reps_and_weights",
                                filter =
                                    Q(reps_and_weights__is_warmup = False) &
                                    Q(reps_and_weights__weight__gt = 0)
                                )
                        )["count"])]
        return exercises[0] if len(exercises) else None
    


class Session_workout(models.Model):
    step = models.DecimalField(decimal_places=1, max_digits=3, blank=True, null=True)
    units_kg = models.BooleanField(blank=True, null=True)
    weight_per_side = models.BooleanField(blank=True, null=True)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, blank=True, null=True)
    session = models.ForeignKey(Session, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return f"{self.id} {self.session.user.get_full_name()}'s {self.exercise.name}"

    def get_session_reps(self):
        return [{int(e.set):{
            "weight":float(e.weight or 0),
            "difficulty":int(e.difficulty or 0),
            "reps":int(e.reps or 0),
            "warmup":e.is_warmup} for e in self.reps_and_weights_set.all()},
            {"id":self.id,
            "step":self.step,
            "uses_kilos":self.units_kg, 
            "per_side":self.weight_per_side}]

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
        last_rep_recorded = Reps_and_weights.objects.filter(session_workout__session__user=user,session_workout__session__workout_performed__workouts_in_plan__in=workouts).order_by("-created_at").first()
        if not last_rep_recorded:
            return workouts.order_by("order").first().workout
        session_of_last_rep = last_rep_recorded.session_workout.session
        workout = session_of_last_rep.workout_performed
        current_session = Session.current_session(user)
        print(model_to_dict(workout))
        if not current_session or current_session != session_of_last_rep:
            order = workouts.get(workout=workout).order
            return workouts.get(order=1 if order == workouts.count() else order+1).workout
        return workout
    
class Friends(models.Model):
    friend_1 = models.ForeignKey(User,related_name="friend_requester",on_delete=models.CASCADE)
    friend_2 = models.ForeignKey(User,related_name="friend_receiver",on_delete=models.CASCADE)
    status = models.BooleanField(default=False)

    @staticmethod
    def friends_of(user):
        return ([e.friend_1 for e in user.friend_receiver.filter(status=True).all()] + 
        [e.friend_2 for e in user.friend_requester.filter(status=True).all()])
    
    def are_friends(user1_id,user2_id):
        return Friends.objects.filter(status=True).filter(Q(friend_1_id=user1_id,friend_2=user2_id)|Q(friend_2_id=user1_id,friend_1=user2_id)).exists()
