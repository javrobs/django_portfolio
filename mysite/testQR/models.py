
from django.utils import timezone
from django.db import models

from django.utils import timezone


# Create your models here.

class QR_token(models.Model):
    name = models.TextField(max_length=3)
    station = models.ForeignKey("testQR.Station", on_delete=models.CASCADE, related_name="owned_tokens")
    location = models.ForeignKey("testQR.Station", on_delete=models.SET_NULL, null=True, blank=True, related_name="tokens_here")

    def is_free(self):
        return self.get_work_order() is None

    def get_name(self):
        return f"{self.station.name}-{self.name.zfill(2)}"

    def work_order_created(self):
        self.location = self.station
        self.save()

    def get_work_order(self):
        try:
            return self.work_order
        except Work_order.DoesNotExist:
            return None

    def release(self):
        self.location = None
        work_order = self.get_work_order()
        if work_order:
            work_order.QR_token = None
            work_order.save()
        self.save()

class Station(models.Model):
    name = models.TextField(max_length=3)
    long_name = models.TextField(max_length=20)
    processes = models.ManyToManyField("testQR.Process", related_name="stations")

    def __str__(self):
        return f"{self.name}({self.id})"

    def get_work_orders(self):
        WO = Work_order.objects.filter(QR_token__location=self).order_by('step','-created_at')
        return [wo.get_info() for wo in WO]

    def is_here(self, work_order):
        return work_order.QR_token.location == self

    def can_receive(self, work_order):
        return work_order.next_step() in self.processes.all() or (work_order.next_step() is None and self.id==2)

class Client(models.Model):
    name = models.TextField(max_length=50)
    code = models.TextField(max_length=20)



class Part_number(models.Model):
    name = models.TextField(max_length=20)
    per_pound = models.FloatField(default=0.0)
    client = models.ForeignKey("testQR.Client",on_delete=models.CASCADE)
    thickness = models.FloatField(default=0.0)

class Process_step(models.Model):
    part_number = models.ForeignKey("testQR.Part_number",on_delete=models.CASCADE)
    order = models.IntegerField() 
    process = models.ForeignKey("testQR.Process",on_delete=models.CASCADE)

class Process(models.Model):
    name = models.TextField(max_length=20)

    def __str__(self):
        return f"{self.name}({self.id})"

class Order(models.Model):
    order_number = models.TextField(max_length=20)
    part_number = models.ForeignKey("testQR.Part_number",on_delete=models.CASCADE)
    created_at = models.DateTimeField(default = timezone.now)
    quantity = models.IntegerField()
    bins = models.IntegerField(default=0)

class Work_order(models.Model):
    order = models.ForeignKey("testQR.Order",on_delete=models.CASCADE)
    parent_work_order = models.ForeignKey("testQR.Work_order",on_delete=models.CASCADE,null=True,blank=True)
    start_qty = models.IntegerField()
    start_bins = models.IntegerField(default=0)
    current_bins = models.IntegerField(default=0)
    current_qty = models.IntegerField()
    created_by = models.TextField()
    created_at = models.DateTimeField(default = timezone.now)
    QR_token = models.OneToOneField("testQR.QR_token", related_name="work_order",null=True,blank=True,on_delete=models.SET_NULL)
    step = models.IntegerField(default=1)

    def get_info(self):
        return {"id": f"WO-{self.id:04d} ({self.QR_token.get_name()})",
        "wo_id": self.id,
        "date": timezone.localtime(self.created_at).strftime("%y/%m/%d %H:%M"),
        "orderNumber": self.order.order_number,
        "order_id": self.order.id,
        "partNumber": self.order.part_number.name,
        "quantity": f"{self.current_qty}({self.current_bins})/{self.order.quantity}({self.order.bins})",
        "next": self.next_step().name if self.next_step() else "Salida",
        "client": self.order.part_number.client.name,
    }

    def current_step(self):
        return self.order.part_number.process_step_set.get(order=self.step).process
    
    def next_step(self):
        try:
            return self.order.part_number.process_step_set.get(order=self.step + 1).process
        except Process_step.DoesNotExist:
            return None

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        # if self.QR_token.station != self.order. TODO: Check if the QR token's station matches the station of the current process step of the part number
        super().save(*args, **kwargs)
        if is_new:
            self.QR_token.work_order_created()  # Link the QR token to this work order when it's created

    def create_child(self, qty, bins, qr_id):
        child_work_order = Work_order.objects.create(order=self.order,
            parent_work_order=self,
            start_qty=qty,
            current_qty=qty,
            start_bins=bins,
            current_bins=bins,
            created_by="Default",
            QR_token=QR_token.objects.get(id=qr_id),
            step= self.step + 1
        )
        self.current_qty = self.current_qty - float(qty)
        self.current_bins = self.current_bins - float(bins)
        print("QTY",self.current_qty)
        if(self.current_qty == 0):
            self.QR_token.location = None
            self.QR_token.save()
        self.save()
        return child_work_order