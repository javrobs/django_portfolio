

from django.core.management.base import BaseCommand, CommandError
from testQR.models import Client, QR_token, Station, Process, Part_number
from django.db import transaction
import csv

class Command(BaseCommand):
    help = "Populates the database with initial data for testing"

    def handle(self,*args,**options):
        try:
            with transaction.atomic():
                #POPULATE PROCESS
                processes = ["Zinc Clear", "Zinc Yellow", "Inspección", "Recepción", "Salida"]
                for i, process in enumerate(processes):
                    process, created = Process.objects.get_or_create(name=process, id=i+1)
                #POPULATE STATIONS
                stations = [{"name":"INV", "long_name": "Inventario","processes":[4,5]}, 
                            {"name":"QLT", "long_name": "Calidad","processes":[3]},
                            {"name":"L15", "long_name": "Línea 15","processes":[1,2]}]
                for i, s in enumerate(stations):
                    station, created = Station.objects.get_or_create(name=s["name"], long_name=s["long_name"], id=i+1)
                    for process_id in s["processes"]:
                        station.processes.add(process_id)
                    station.save()
                    #POPULATE QR TOKENS
                    for i in range(1, 21):
                        QR_token.objects.get_or_create(name=str(i).zfill(2), station=station)
                with open("clients.csv", newline='', encoding='utf-8') as csvfile:
                    reader = csv.reader(csvfile, dialect='excel')   
                    headers = next(reader)  # Skip the header row
                    for row in reader:
                        client, created = Client.objects.get_or_create(
                            id=row[0],
                            name=row[1],
                            code=row[2]
                        )
                with open("parts.csv", newline='', encoding='utf-8') as csvfile:
                    reader = csv.reader(csvfile, dialect='excel')   
                    next(reader)  # Skip the header row
                    num = 1
                    for row in reader:
                        part_number, created = Part_number.objects.get_or_create(
                            id=num,
                            name=row[0],
                            per_pound=0.0,
                            client_id= row[1],
                            thickness = row[3]
                        )
                        num += 1
                        part_number.process_step_set.create(order=1, process_id=4)
                        part_number.process_step_set.create(order=2, process_id=row[2])
                        part_number.process_step_set.create(order=3, process_id=3)
                        part_number.process_step_set.create(order=4, process_id=5)
                        part_number.save()
        except Exception as e:
            raise CommandError(f'Something went wrong: {e}')