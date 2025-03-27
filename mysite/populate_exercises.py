import csv
from exercisapp.models import Exercise,Muscle_group
            
def load_exercises():
    file = []
    with open('../populate/exercises_and_muscles.csv', encoding='utf-8-sig' ) as csvfile:
        reader = csv.DictReader(csvfile)
        print("reading file")
        file = [row for row in reader]
    for x in file:
        print(x)
        muscles = [Muscle_group.objects.get_or_create(name=muscle) for muscle in x["muscle"].split(".")] 
        [print(muscle[0].name,"created" if muscle[1] else "existed") for muscle in muscles]
        new_exercise,created = Exercise.objects.get_or_create(name=x["name"],lower_reps=x["lower"],higher_reps=x["higher"],uses_bar=x["bar"])
        print(new_exercise.name,"created" if created else "existed")
        for muscle,created in muscles:
            new_exercise.muscle_group.add(muscle)
        

        