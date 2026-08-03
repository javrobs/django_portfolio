import json
import token

from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import render
from testQR.models import *
from django.middleware.csrf import get_token



def main(request, loc=None, qr=None):
    get_token(request)
    return render(request,'tester/indexTester.html')


# GET CALLS:
def api_QR(request, loc, qr):
    try:
        token = QR_token.objects.get(name=str(qr).zfill(2), station__id=loc)
    except:
        return JsonResponse({"error": "QR not found"}, status=404)
    response = {'qr_name': f"{token.station.name}-{token.name.zfill(2)}", 
                "is_free": token.get_work_order() == None, 
                'station': token.station.id,
                'qr_id': token.id}
    if not response["is_free"]:
        response["work_order"] = token.get_work_order().get_info() if token.get_work_order() else None
        response["PO"] = token.get_work_order().order.order_number if token.get_work_order() else None
    return JsonResponse(response)

def api_validate_QR(request, loc, qr, actor, action):
    error = "Error desconocido"
    error_string = ""
    print(loc,qr,actor,action)
    try:
        token = QR_token.objects.get(name=str(qr).zfill(2), station__id=loc)
        station = Station.objects.get(id=actor)
        print(station.name)
        if action == "createPO":
            if(token.station.id != 1):
                error = "Este QR no es de almacén"
            elif station.id != 1:
                error = "Usuario no pertenece a inventario"
            elif token.get_work_order() is not None:
                error = "El QR ya está ocupado"
            else:
                return api_QR(request, loc, qr) 
        elif action == "exitWOOut":
            if(token.station != station):
                error = "Este QR no es de aquí"
            elif token.get_work_order() is not None:
                error = "El QR ya está ocupado"
            else:
                return api_QR(request, loc, qr)
        elif action == "enterStation":
            work_order = token.get_work_order()
            if not work_order:
                error = "El QR está libre, no hay WO asociada"
            elif station.can_receive(work_order) == False:
                error = "La WO no puede entrar a esta estación"
            elif station.is_here(work_order):
                error = "La WO ya está registrada aquí"
            else:
                return api_QR(request, loc, qr)
        elif action == "exitWOIn":
            work_order = token.get_work_order()
            print(station.is_here(work_order))
            if not work_order:
                error = "El QR está libre, no hay WO asociada"
            elif station.is_here(work_order) == False:
                error = "La WO no está registrada aquí"
            elif work_order.QR_token.station == station:
                error = "La WO ya se proceso aquí"
            else:
                return api_QR(request, loc, qr)
        elif action == "finishIn":
            work_order = token.get_work_order()
            if not work_order:
                error = "El QR está libre, no hay WO asociada"
            elif(station.is_here(work_order) == False):
                error = "Esta WO no está registrada aquí"
            else:
                return api_QR(request, loc, qr)     
        elif action == "finishOut":
            work_order = token.get_work_order()
            print(token.station)
            if work_order is not None:
                error = "El QR ya está ocupado"
            elif(token.station.id != 2):
                error = "Este QR no es de salida"
            else:
                return api_QR(request, loc, qr)              
    except QR_token.DoesNotExist:
        error = "QR not found"
    except Station.DoesNotExist:
        error = "Station not found"
    except Exception as e:
        error_string = str(e)
    print(error, error_string)
    return JsonResponse({"error": error}, status=500)
    
    


def api_clients(request):
    clients = Client.objects.all()
    print([c.name for c in clients])
    return JsonResponse({"clients":[{"id":c.id,"text":c.name} for c in clients]})

def api_parts(request, client_id):
    parts = Part_number.objects.filter(client__id=client_id)
    return JsonResponse({"parts":[{"id":p.id,"text":p.name} for p in parts]})

def api_work_orders(request, station_id):
    station = Station.objects.get(id=station_id)
    return JsonResponse({"work_orders": station.get_work_orders()})

# POST CALLS:
def api_submit_new_po(request, role):
    try:
        with transaction.atomic():
            if request.method == "POST":
                if role != 1:
                    return JsonResponse({"error": "Usuario no pertenece a inventario"}, status=403)
                data = json.loads(request.body)
                client_id = data.get("client")
                part_id = data.get("part_number")
                po_number = data.get("po")
                bins = data.get("bins")
                quantity = data.get("quantity")
                qr_id = data.get("qr_id")


                # Validate the input data
                if not all([client_id, part_id, po_number, bins, quantity, qr_id]):
                    return JsonResponse({"error": "Faltan campos requeridos"}, status=400)

                # Get the Client and Part_number instances
                client = Client.objects.get(id=client_id)
                part = Part_number.objects.get(id=part_id, client=client)
                order = Order.objects.create(order_number=po_number, part_number=part, quantity=quantity, bins=bins)

                STATION = part.process_step_set.order_by('order').first().process.stations.first() #Inventory station is the first station in the process of the part number
                qr_token = QR_token.objects.get(id=qr_id)
                if qr_token.get_work_order() is not None:
                    return JsonResponse({"error": "QR token ya está asignado"}, status=400)
                if qr_token.station != STATION:
                    return JsonResponse({"error": "QR token no es válido para este part number"}, status=400)
                
                work_order = Work_order.objects.create(
                    order=order,
                    start_qty=quantity,
                    current_qty=quantity,
                    start_bins=bins,
                    current_bins=bins,
                    created_by="API",
                    QR_token=qr_token
                )
            return JsonResponse({"message": "PO submitted successfully", "work_order_id": work_order.id})
    except Exception as e:
        print(f"Error in api_submit_new_po: {e}")
        return JsonResponse({"error": "Unknown"}, status=500)

def api_enter_station(request, role):
    try:
        with transaction.atomic():
            if request.method == "POST":
                data = json.loads(request.body)
                print(data)
                station = Station.objects.get(id=role)
                work_order = Work_order.objects.get(id=data.get("work_order").get("wo_id"))
                if not station.can_receive(work_order):
                    return JsonResponse({"error": "Station cannot receive this work order"}, status=400)
                work_order.QR_token.location = station if station.id != 2 else Station.objects.get(id=1)
                work_order.QR_token.save()
                work_order.save()
                return JsonResponse({"message": "Work order entered station successfully", "work_order_id": work_order.id})
    except Exception as e:
        print(f"Error in api_enter_station: {e}")
        return JsonResponse({"error": "Unknown"}, status=500)

def api_exit_wo(request, role):
    try:
        with transaction.atomic():
            if request.method == "POST":
                data = json.loads(request.body)
                print(data)
                station = Station.objects.get(id=role)
                work_order = Work_order.objects.get(id=data["in"]["work_order"]["wo_id"])
                token_out = QR_token.objects.get(id=data["out"]["qr_id"])
                if token_out.station != station:
                    return JsonResponse({"error": "QR token does not belong to this station"}, status=400)
                if not station.is_here(work_order):
                    return JsonResponse({"error": "Station does not have this work order"}, status=400)
                if token_out.get_work_order() is not None:
                    return JsonResponse({"error": "QR token is already associated with a work order"}, status=400)
                new_wo = work_order.create_child(data.get("quantity"), data.get("bins"), data["out"]["qr_id"])
                return JsonResponse({"message": "Work order exited station successfully", "work_order_id": new_wo.id})
    except Exception as e:
        print(f"Error in api_exit_wo: {e}")
        return JsonResponse({"error": "Unknown"}, status=500)


def api_finish(request, role):
    try:
        with transaction.atomic():
            if request.method == "POST":
                data = json.loads(request.body)
                work_order = Work_order.objects.get(id=data["in"]["work_order"]["wo_id"])
                token_out = QR_token.objects.get(id=data["out"]["qr_id"])
                station = Station.objects.get(id=role)
                if not work_order:
                    return JsonResponse({"error": "El QR está libre, no hay WO asociada"}, status=400)
                elif(station.is_here(work_order) == False):
                    return JsonResponse({"error": "Esta WO no está registrada aquí"}, status=400)
                elif token_out.station.id != 2:
                    return JsonResponse({"error": "QR token does not belong to this station"}, status=400)
                elif token_out.get_work_order() is not None:
                    return JsonResponse({"error": "QR token is already associated with a work order"}, status=400)
                if work_order.QR_token.station == station:
                    new_wo = work_order.create_child(work_order.current_qty, work_order.current_bins, data["out"]["qr_id"])
                    
                    work_order.QR_token.location = None
                    work_order.QR_token.save()
                else:
                    new_wo = work_order.create_child(data.get("quantity"), data.get("bins"), data["out"]["qr_id"])
                new_wo.step += 1
                new_wo.save()
                token_out.location = station
                token_out.save()
                return JsonResponse({"message": "Work order exited station successfully", 
                                     "work_order_id": new_wo.id
                                     })
    except Exception as e:
        print(f"Error in api_exit_wo: {e}")
        return JsonResponse({"error": "Unknown"}, status=500)

                


