from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Count,Sum
import time

from .models import CommunityDistrict,Language,LEPPopulation,Borough
# Create your views here.

def main(request):
    """Can you see me?"""
    # return HttpResponse('<a href="//www.google.com">Hello</a>')
    return render(request,"esl_ny/main.html",{'languages':Language.objects.all()})

def communities(request,language=None):
    """Return boroughs"""
    list_of_features=[district.geojson for district in CommunityDistrict.objects.all()]
    for feature in list_of_features:
        get_cd=CommunityDistrict.objects.get(pk=feature['properties']['boro_cd'])
        feature['properties']['population']=get_cd.leppopulation_set.aggregate(Sum('lep_population'))['lep_population__sum']
        feature["properties"]["name"]=get_cd.name
        feature["properties"]["borough"]=get_cd.borough.name
    context={"type": "FeatureCollection",
            "features": list_of_features}
    return JsonResponse(context)

def population(request):
    # """"Return populations?"""
    start_time=time.time()
    boroughs=[{'id':b.id,'label':b.name,'parent':'NYC LEP Speakers','value':0} for b in Borough.objects.all()]
    districts=[{'id':d.id,'label':d.name,'parent':d.borough.id,'value':0} for d in CommunityDistrict.objects.all()]
    population=[{'id':pop.id,'label':pop.language.name,'parent':pop.communitydistrict.id,'value':pop.lep_population} for pop in LEPPopulation.objects.all()]
    print('Method one',time.time()-start_time)
    start_time=time.time()
    print('Reset timer',time.time()-start_time)
    resulting_list=[]
    for b in Borough.objects.all():
        resulting_list.append({'id':b.id,'label':b.name,'parent':'NYC LEP Speakers','value':0})
        for d in b.communitydistrict_set.all():
            resulting_list.append({'id':d.id,'label':d.name,'parent':d.borough.id,'value':0})
            for pop in d.leppopulation_set.all():
                resulting_list.append({'id':pop.id,'label':pop.language.name,'parent':pop.communitydistrict.id,'value':pop.lep_population})
    print('Method two',time.time()-start_time)
    # For some reason, going into all LEP populations together took longer than separating into community districts
    return JsonResponse({'list':resulting_list})


def population_language(request,language):
    # """"Return populations?"""
    language_name=Language.objects.get(id=language).name
    start_time=time.time()
    boroughs=[{'id':b.id,'label':b.name,'parent':f'NYC LEP<br>{language_name}<br>Speakers','value':0} for b in Borough.objects.filter(communitydistrict__leppopulation__language__id=language).distinct().all()]
    districts=[{'id':d.id,'label':d.name,'parent':d.borough.id,'value':d.leppopulation_set.get(language=language).lep_population} for d in CommunityDistrict.objects.filter(leppopulation__language__id=language).distinct().all()]
    print('Method one',time.time()-start_time)
    start_time=time.time()
    print('Reset timer',time.time()-start_time)
    resulting_list=[]
    for b in Borough.objects.filter(communitydistrict__leppopulation__language__id=language).distinct().all():
        resulting_list.append({'id':b.id,'label':b.name,'parent':f'NYC LEP<br>{language_name}<br>Speakers','value':0})
        for d in b.communitydistrict_set.filter(leppopulation__language__id=language).distinct().all():
            resulting_list.append({'id':d.id,'label':d.name,'parent':d.borough.id,'value':d.leppopulation_set.get(language=language).lep_population})    
    print('Method two',time.time()-start_time)
    return JsonResponse({'list':boroughs+districts,'other_list':resulting_list})

def demographic(request,language=None):
    """"Return populations?"""
    return JsonResponse({'data':True})

# @app.route("/populations_all")
# def population_api():
#     # Filter out 0 in LEP Population (To not show languages with 0 speakers every single time)
#     query={'LEP Population (Estimate)':{"$gt":0}}
#     population_json=populations.find(query)
#     population_list=[]
#     # Pop the _id key for each entry and append the results into a list
#     for each in population_json:
#         each.pop("_id")
#         population_list.append(each)
#     #Return full list of population values
#     return jsonify(population_list) 


def language_all(request,language=None):
    """Ï think total of speakers"""
    context={''}

    return JsonResponse(context)

 

# # Merge together communities(GEOJSON) and a numerical value with the total LEP population of each community district
# @app.route("/communities_all")
# def communities_api():

#     #Mongo query to retrieve our GEOJSON. It's all a single entry in our database and store in a variable
#     com_dict = communities.find_one({})
#     #Get rid of automatically generated _id key
#     com_dict.pop("_id")

#     #Mongo query to retrieve all the documents in the populations collection and store in a variable
#     pop_dict= list(populations.find())
#     #Get rid of automatically generated _id key
#     for each in pop_dict:
#         each.pop("_id")
    
#     #Use Pandas Groupby to sum the populations ignoring language
#     df=pd.DataFrame(pop_dict).groupby(["Borough Community District Code","Borough","Community District Name"]).sum()[["LEP Population (Estimate)"]].reset_index(drop=False).set_index("Borough Community District Code")
#     #Turn results back into a python dictionary
#     merged=df.to_dict(orient="dict")

#     #For each feature inside the geojson results, try adding the properties obtained from the merged variable
#     for i,each in enumerate(com_dict["features"]):
#         try: 
#             each["properties"]["population"]=merged["LEP Population (Estimate)"][each["properties"]["boro_cd"]]
#             each["properties"]["name"]=merged["Community District Name"][each["properties"]["boro_cd"]]
#             each["properties"]["borough"]=merged["Borough"][each["properties"]["boro_cd"]]
#         #The geojson contains extra poligons for parks and airports, which we don't want in our final result. Store 0s for now
#         except:
#             each["properties"]["population"]=0
#             each["properties"]["name"]=0
#             each["properties"]["borough"]=0
#     #Filter out the 0s we created because they have no population (from being public areas)
#     com_dict["features"]=list(filter(lambda line: line["properties"]["name"]!=0,com_dict["features"]))
    
#     #Send joined data to API route
#     return jsonify(com_dict)


# # Merge together communities(GEOJSON) and a numerical value with the LEP population of a specific language of each community district
# @app.route("/communities/<language>")
# def communities_language_api(language):

#     #Mongo query to retrieve our GEOJSON. It's all a single entry in our database and store in a variable
#     com_dict = communities.find_one({})
#     #Get rid of automatically generated _id key
#     com_dict.pop("_id")
  
#     #Mongo query to retrieve the documents in the populations that include the "language" variable and store in a variable  
#     query = {"Language" : language}
#     #Only include a few columns
#     include = {"Language": 1, "LEP Population (Estimate)":1, "Borough Community District Code": 1, "Community District Name":1,"Borough":1}
#     pop_dict= list(populations.find(query, include))
#     #Set up an empty dictionary
#     merged = {}
#     for each in pop_dict:
#         #Set up district code as key in the merged dictionary. The value will be a list of three items: The population, the community district name and the borough
#         merged[each ["Borough Community District Code"]] = [each ["LEP Population (Estimate)"],each["Community District Name"],each["Borough"]]

#     #For each feature inside the geojson results, try adding the properties obtained from the merged variable  
#     for each in com_dict["features"]:
#         try: 
#             each["properties"]["population"]=merged[each["properties"]["boro_cd"]][0]
#             each["properties"]["name"]=merged[each["properties"]["boro_cd"]][1]
#             each["properties"]["borough"]=merged[each["properties"]["boro_cd"]][2]
#         #The geojson contains extra poligons for parks and airports, which we don't want in our final result. Store 0s for now
#         except:
#             each["properties"]["population"]=0
#             each["properties"]["name"]=0
#             each["properties"]["borough"]=0
#     #Filter out the 0s we created because they have no population (from being public areas)
#     com_dict["features"]=list(filter(lambda line: line["properties"]["name"]!=0,com_dict["features"]))
    
#     #Send joined data to API route
#     return jsonify(com_dict)


# @app.route("/populations_all")
# def population_api():
#     # Filter out 0 in LEP Population (To not show languages with 0 speakers every single time)
#     query={'LEP Population (Estimate)':{"$gt":0}}
#     population_json=populations.find(query)
#     population_list=[]
#     # Pop the _id key for each entry and append the results into a list
#     for each in population_json:
#         each.pop("_id")
#         population_list.append(each)
#     #Return full list of population values
#     return jsonify(population_list)

# @app.route("/populations/<language>")
# def population_language_api(language):
#     # Filter out 0 in LEP Population, matching with language from the request
#     query={'LEP Population (Estimate)':{"$gt":0},'Language':language}
#     population_json=populations.find(query)
#     population_list=[]
#     # Pop the _id key for each entry and append the results into a list
#     for each in population_json:
#         each.pop("_id")
#         population_list.append(each)
#     #Return full list of population values
#     return jsonify(population_list)

# @app.route("/demographic_all")
# def demographics_all_api():
#     # Filter out 0 in LEP Population (To not show languages  with 0 speakers every single time)
#     query={'LEP Population (Estimate)':{"$gt":0}}
#     population_json=populations.find(query)
#     # convert it into a dataframe to work with it more easily
#     total_population_df = pd.DataFrame(population_json)
#     # get the sum of all the LEP in new york city.
#     total_population=sum(total_population_df['LEP Population (Estimate)'])
#     response_dict = {}
#     # place sum into a json directory.
#     response_dict["Language"]="All"
#     response_dict["Total LEP population"] = total_population
    
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

