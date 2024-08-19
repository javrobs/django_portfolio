from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Count,Sum,F
import time

from .models import CommunityDistrict,Language,LEPPopulation,Borough
# Create your views here.

def main(request):
    """Can you see me?"""
    return render(request,"esl_ny/main.html",{'languages':Language.objects.order_by('name').all()})

def all_data(request,language=None):
    data_together={}
    data_together['communities']=communities(request,language,True)
    data_together['populations']=population(request,True) if language==None else population_language(request,language,True)
    data_together['demographic']=demographic(request,language,True)
    return JsonResponse(data_together)

def communities(request,language=None,return_json=False):
    """Return boroughs with geographic info for all LEP speakers"""
    start_time=time.time()
    community_districts=CommunityDistrict.objects
    if language!=None: 
        community_districts=community_districts.filter(leppopulation__language__id=language)  
    list_of_features=community_districts.annotate(borough_name=F('borough__name'),population=Sum('leppopulation__lep_population')).values('geojson','population','name','borough_name')
    appended_list=[]
    for feature in list_of_features:
        feature['geojson']['properties'].update(
                {'population':feature['population'],
                 "name":feature['name'],
                 "borough":feature['borough_name']})
        appended_list.append(feature['geojson'])
    context={"type":'FeatureCollection',"features":appended_list,'servertime':time.time()-start_time}
    return context if return_json else JsonResponse(context)

def geojson(request,return_json=False):
    start_time=time.time()
    context={'features':list(CommunityDistrict.objects.values('geojson')),'servertime':time.time()-start_time}
    return context if return_json else JsonResponse(context)

def population(request,return_json=False):
    """"Return all LEP populations for sunburst"""
    start_time=time.time()
    resulting_list=[{'id':b['id'],'label':b['name'],'parent':'NYC LEP Speakers','value':b['value']} for b in Borough.objects.annotate(value=Sum('communitydistrict__leppopulation__lep_population')).values()]
    resulting_list+=list(CommunityDistrict.objects.annotate(label=F('name'),parent=F('borough_id'),value=Sum('leppopulation__lep_population')).values('id','label','parent','value'))
    resulting_list+=list(LEPPopulation.objects.annotate(label=F('language__name'),parent=F('communitydistrict_id'),value=F('lep_population')).values('id','label','parent','value'))
    context={'list':resulting_list,'servertime':time.time()-start_time}
    return context if return_json else JsonResponse(context)

def population_language(request,language,return_json=False):
    """"Return populations?"""
    start_time=time.time()
    language_name=Language.objects.get(id=language).name
    boroughs=Borough.objects.filter(communitydistrict__leppopulation__language__id=language).annotate(value=Sum('communitydistrict__leppopulation__lep_population')).distinct().values()
    resulting_list=[{'id':b['id'],'label':b['name'],'parent':f'NYC LEP<br>{language_name}<br>Speakers','value':b['value']} for b in boroughs]
    districts=LEPPopulation.objects.filter(language__id=language).annotate(parent=F('communitydistrict__borough')).values('communitydistrict_id','communitydistrict__name','parent','lep_population')
    resulting_list+=[{'id':d['communitydistrict_id'],'label':d['communitydistrict__name'],'parent':d['parent'],'value':d['lep_population']} for d in districts]    
    context={'list':resulting_list,'servertime':time.time()-start_time}
    return context if return_json else JsonResponse(context)


def demographic(request,language=None,return_json=False):
    """"Return populations?"""
    context={}
    start_time=time.time()
    totalLEPPopulation=LEPPopulation.objects.aggregate(Sum('lep_population'))['lep_population__sum']
    if language!=None:
        context['selectedLanguage']=Language.objects.get(id=language).name
        context['totalLEPpopulation']=LEPPopulation.objects.filter(language_id=language).aggregate(Sum('lep_population'))['lep_population__sum']
        context['lepPercentage']=round(context['totalLEPpopulation']/totalLEPPopulation*100,3)
        context['largestLEPs']=list(LEPPopulation.objects.filter(language_id=language)
                                    .annotate(borough_name=F('communitydistrict__borough__name'),
                                              community_district=F('communitydistrict__name'))
                                    .order_by('-lep_population')[:5]
                                    .values('borough_name','community_district','lep_population'))
    else:
        context['totalLEPpopulation']=totalLEPPopulation
        context['largestLEPs']=list(CommunityDistrict.objects
                                    .annotate(borough_name=F('borough__name'),
                                              community_district=F('name'),
                                              lep_population=Sum('leppopulation__lep_population'))
                                    .order_by('-lep_population')[:5]
                                    .values('borough_name','community_district','lep_population'))
    context['servertime']=time.time()-start_time
    return context if return_json else JsonResponse(context)