
from esl_ny.models import CommunityDistrict,Language,LEPPopulation,Borough
from django.db.models import Count,Sum,F
import time

context={}
start_time=time.time()
# totalLEPPopulation=LEPPopulation.objects.aggregate(Sum('lep_population'))['lep_population__sum']
# context['totalLEPpopulation']=totalLEPPopulation
# print(time.time()-start_time)
context['largestLEPs']=list(CommunityDistrict.objects
                            .annotate(borough_name=F('borough__name'),lep_population=Sum('leppopulation__lep_population'))
                            .order_by('-lep_population')[:5]
                            .values('borough_name','name','lep_population'))
print(time.time()-start_time)


"""Return boroughs with geographic info for all LEP speakers"""
start_time=time.time()
community_districts=CommunityDistrict.objects
list_of_features=community_districts.annotate(population=Sum('leppopulation__lep_population'),borough_name=F('borough__name')).values('population','name','borough_name')
# appended_list=[]
# for feature in list_of_features:
#     feature['geojson']['properties'].update(
#             {'population':feature['population'],
#                 "name":feature['name'],
#                 "borough":feature['borough_name']})
#     appended_list.append(feature['geojson'])
context={"type":'FeatureCollection',"features":list(list_of_features),'servertime':time.time()-start_time}
print(time.time()-start_time)