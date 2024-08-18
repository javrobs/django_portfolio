from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Count,Sum
import time

from .models import CommunityDistrict,Language,LEPPopulation,Borough
# Create your views here.

def main(request):
    """Can you see me?"""
    return render(request,"esl_ny/main.html",{'languages':Language.objects.order_by('name').all()})

def communities(request):
    """Return boroughs with geographic info for all LEP speakers"""
    list_of_features=[district.geojson for district in CommunityDistrict.objects.all()]
    start_time=time.time()
    for feature in list_of_features:
        get_cd=CommunityDistrict.objects.get(pk=feature['properties']['boro_cd'])
        feature['properties']['population']=get_cd.leppopulation_set.aggregate(Sum('lep_population'))['lep_population__sum']
        feature["properties"]["name"]=get_cd.name
        feature["properties"]["borough"]=get_cd.borough.name
    context={"type": "FeatureCollection",
            "features": list_of_features}
    print('map-time',time.time()-start_time)
    return JsonResponse(context)

def communities_language(request,language):
    """Return boroughs with geographic info specific to one language"""
    list_of_features=[district.geojson for district in CommunityDistrict.objects.filter(leppopulation__language__id=language)]
    for feature in list_of_features:
        get_cd=CommunityDistrict.objects.get(pk=feature['properties']['boro_cd'])
        feature['properties']['population']=LEPPopulation.objects.filter(language_id=language).get(communitydistrict=get_cd).lep_population
        feature["properties"]["name"]=get_cd.name
        feature["properties"]["borough"]=get_cd.borough.name
    context={"type": "FeatureCollection",
            "features": list_of_features}
    return JsonResponse(context)

def population(request):
    """"Return all LEP populations for sunburst"""
    resulting_list=[]
    for b in Borough.objects.all():
        resulting_list.append({'id':b.id,'label':b.name,'parent':'NYC LEP Speakers','value':LEPPopulation.objects.filter(communitydistrict__borough=b).aggregate(Sum('lep_population'))['lep_population__sum']})
        for d in b.communitydistrict_set.all():
            resulting_list.append({'id':d.id,'label':d.name,'parent':d.borough.id,'value':LEPPopulation.objects.filter(communitydistrict=d).aggregate(Sum('lep_population'))['lep_population__sum']})
            for pop in d.leppopulation_set.all():
                resulting_list.append({'id':pop.id,'label':pop.language.name,'parent':pop.communitydistrict.id,'value':pop.lep_population})
    # For some reason, going into all LEP populations together took longer than separating into community districts
    return JsonResponse({'list':resulting_list})

def population_language(request,language):
    """"Return populations?"""
    language_name=Language.objects.get(id=language).name
    resulting_list=[]
    for b in Borough.objects.filter(communitydistrict__leppopulation__language__id=language).distinct().all():
        resulting_list.append({'id':b.id,'label':b.name,'parent':f'NYC LEP<br>{language_name}<br>Speakers','value':LEPPopulation.objects.filter(communitydistrict__borough=b).filter(language_id=language).aggregate(Sum('lep_population'))['lep_population__sum']})
        for d in b.communitydistrict_set.filter(leppopulation__language__id=language).distinct().all():
            resulting_list.append({'id':d.id,'label':d.name,'parent':d.borough.id,'value':d.leppopulation_set.get(language=language).lep_population})    
    return JsonResponse({'list':resulting_list})

def demographic(request,language=None):
    """"Return populations?"""
    context={}
    start_time=time.time()
    totalLEPPopulation=LEPPopulation.objects.aggregate(Sum('lep_population'))['lep_population__sum']
    if language!=None:
        context['totalLEPpopulation']=LEPPopulation.objects.filter(language_id=language).aggregate(Sum('lep_population'))['lep_population__sum']
        context['lepPercentage']=round(context['totalLEPpopulation']/totalLEPPopulation*100,2)
        context['largestLEPs']=[{"borough":lep.communitydistrict.borough.name,
                                 "population":lep.lep_population,
                                 "community_district":lep.communitydistrict.name,
                                 "language":lep.language.name} for lep in LEPPopulation.objects.filter(language_id=language).order_by('-lep_population')[:5]]
    else:
        context['totalLEPpopulation']=totalLEPPopulation
        context['largestLEPs']=[{"borough":lep.communitydistrict.borough.name,
                                 "population":lep.lep_population,
                                 "community_district":lep.communitydistrict.name,
                                 "language":lep.language.name} for lep in LEPPopulation.objects.order_by('-lep_population')[:5]]
    print('sum-of-population',time.time()-start_time)
    return JsonResponse(context)

# @app.route("/demographic_all")
# def demographics_all_api():
  
# # information for BIGGEST  5 LEP communities
# # query only over 0 lep
#     query={'LEP Population (Estimate)':{"$gt":0}}
#     # sort descending to get TOP 5 most populated
#     sort=[('LEP Population (Estimate)',-1)]
#     # select specific fields for information you need ONLY.
#     fields ={"Borough":1,"LEP Population (Estimate)":1,"Community District Name":1,"Language":1}
#     limit=5
#     demo_list= []
#     demo_data=populations.find(query,fields).sort(sort).limit(limit)
#     # added to js directory 
#     for each in demo_data:
#         each.pop("_id")
#         demo_list.append(each)
#     response_dict["Biggest Communities"]=demo_list
#     return jsonify(response_dict)


# @app.route("/demographic/<language>")
# def demographic_api(language):
#         # Filter out 0 in LEP Population (To not show languages  with 0 speakers every single time)

#     query={'LEP Population (Estimate)':{"$gt":0}}
#     population_json=populations.find(query)
#     # convert to dataframe to work with it with more ease.
#     total_population_df = pd.DataFrame(population_json)
#     # get total population PER LANGUAGE
#     total_population=sum(total_population_df['LEP Population (Estimate)'])
# # fetch only directories corresponding to specific language.
#     match_query= {'$match':{'Language': language}}
#     # get the sum for each of the languages
#     group_query = {'$group':{'_id':'$Language','sum':{'$sum':'$LEP Population (Estimate)'}}}
#     # create pipeline with match and groupby
#     pipeline=[match_query,group_query]
#     # add to pipeline TOTAL LEP SPEAKERS to be able to calculate percentage
#     language_sum= list(populations.aggregate(pipeline))[0]['sum']
#     # add it all into a dictionary
#     result_dict={}
#     result_dict['LEP Percentage']="{:.5%}".format(language_sum/total_population)
#     result_dict['Language']=language
#     result_dict['Total LEP population']=language_sum
#     # 5 biggest communities that speak this language!!!!
#     # query with language filter
#     query={'LEP Population (Estimate)':{"$gt":0},'Language':language}
#     # sort descending to get top 5 most populated per language
#     sort=[('LEP Population (Estimate)',-1)]
#     # fetch only necessary fields
#     fields ={"Borough":1,"LEP Population (Estimate)":1,"Community District Name":1}
#     # get only 5 of thosse 
#     limit=5
#     demo_list= []
#     # place all in one
#     demo_data=populations.find(query,fields).sort(sort).limit(limit)
#     # make a dictionary for each of the elements.
#     for each in demo_data:
#         each.pop("_id")
#         demo_list.append(each)
#     result_dict[f"Biggest Communities"]=demo_list
#     return (result_dict)

