from django.contrib import admin
from .models import *

# Register your models here.
class QR_tokenAdmin(admin.ModelAdmin):
    list_display = ["id","name","get_name","station","is_free","location"]

class StationAdmin(admin.ModelAdmin):
    list_display = ["id","name","long_name",'get_processes']

    def get_processes(self, obj):
        return ", ".join([a.name for a in obj.processes.all()])
    # get_processes.short_description = 'Authors'

class ClientAdmin(admin.ModelAdmin):
    list_display = ["id","name","code"]

class Part_numberAdmin(admin.ModelAdmin):
    list_display = ["id","name","per_pound","client","thickness"]

class Process_stepAdmin(admin.ModelAdmin):
    list_display = ["id","part_number","order","process"]

class ProcessAdmin(admin.ModelAdmin):
    list_display = ["id","name"]

class OrderAdmin(admin.ModelAdmin):
    list_display = ["id","order_number","part_number","created_at","quantity"]

class Work_orderAdmin(admin.ModelAdmin):
    list_display = ["id","order","parent_work_order","start_qty","current_qty","created_by","created_at","QR_token","step","location"]
    
    def location(self, obj):
        return obj.QR_token.location

admin.site.register(QR_token, QR_tokenAdmin)
admin.site.register(Station, StationAdmin)
admin.site.register(Client, ClientAdmin)
admin.site.register(Part_number, Part_numberAdmin)
admin.site.register(Process_step, Process_stepAdmin)
admin.site.register(Process, ProcessAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(Work_order, Work_orderAdmin)