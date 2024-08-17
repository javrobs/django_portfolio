from django.db import models

# Create your models here.
class Borough(models.Model):
    name = models.CharField(max_length = 20)

    def __str__(self):
        return self.name
    
class CommunityDistrict(models.Model):
    name = models.CharField(max_length = 100)
    borough = models.ForeignKey(Borough, on_delete = models.CASCADE)
    geojson = models.JSONField()

    def __str__(self):
        return self.name
    


class Language(models.Model):
    name = models.CharField(max_length = 50)

    def __str__(self):
        return self.name
    

class LEPPopulation(models.Model):
    communitydistrict = models.ForeignKey(CommunityDistrict, on_delete = models.CASCADE)
    language = models.ForeignKey(Language, on_delete = models.CASCADE)
    lep_population = models.IntegerField()
    cvalep_population = models.IntegerField()

    def __str__(self):
        return f'{self.lep_population},{self.cvalep_population} speak {self.language} in {self.communitydistrict}'