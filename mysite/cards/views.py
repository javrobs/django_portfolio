from django.shortcuts import render
from django.http.response import JsonResponse
from django.views.decorators.http import require_POST
from django.db.models.functions import Concat
from django.db.models import F
from .models import Tag,Card,Other_related_words,Word_type
import json
import random

# Create your views here.
def main(request,*args,**other):
    return render(request,'cards/index.html')

def home_load(request):
    tags = [{"id":tag.id,"name":tag.name,"studied_words":tag.card_set.filter(studied__gt=0).count(),"word_amount":tag.card_set.count()}for tag in Tag.objects.all()]
    print(tags)
    return JsonResponse({"tags":tags})

def tag_load(request,tag_id):
    tag = Tag.objects.get(id=tag_id)
    result = {"title":tag.name}
    result["cards"] = [card.card_data() for card in tag.card_set.all()]
    return JsonResponse(result)


def known_load(request,amount):
    pks = Card.objects.filter(studied__gt=0)
    title = "Known words"
    return load_amount(amount,title,pks)

def new_load(request,amount):
    title="New words"
    pks=Card.objects.filter(studied=0)
    return load_amount(amount,title,pks)

def create_new_load(request):
    return JsonResponse({"tags": list(Tag.objects.values("id","name")),
                         "types": list(Word_type.objects.values("id","name"))
                        })

def annotate(request,amount):
    title="Annotate"
    pks = Card.objects.filter(user_notes__isnull=True,card__isnull=True,related_words__isnull=True,other_related_words__isnull=True)
    return load_amount(amount,title,pks)

def load_amount(amount,title,pks):
    cards = [Card.objects.get(id=id).card_data() for id in random.sample(list(pks.values_list("id",flat=True)),amount if amount < len(pks) else len(pks))]
    return JsonResponse({"cards":cards,"title":title})

@require_POST
def study_word(request):
    json_data = json.loads(request.body)
    card = Card.objects.get(id=json_data["id"])
    card.studied += 1
    card.save()
    return JsonResponse({"card":card.card_data()})


@require_POST
def send_related_words(request):
    json_data = json.loads(request.body)
    card = Card.objects.get(id=json_data["id"])
    card.relate_words(json_data["relatedWords"])
    card.save()
    print(card)
    return JsonResponse({"newRelatedWords":list(card.related_words.values("id","word","tag__id"))+list(card.card_set.values("id","word","tag__id"))+list(card.other_related_words_set.values("word")),"card":card.card_data()})

@require_POST
def save_user_notes(request):
    json_data = json.loads(request.body)
    card = Card.objects.get(id=json_data["id"])
    card.user_notes = json_data["value"]
    card.save()
    return JsonResponse({"new_user_notes":card.user_notes,"card":card.card_data()})

@require_POST
def create_new_card(request):
    json_data = json.loads(request.body)
    tag = Tag.objects.get(id=json_data["tag"])
    types = Word_type.objects.filter(id__in=json_data['types']).all()
    match_word = Other_related_words.objects.filter(word=json_data["word"]).first()
    if match_word:
        print("word matches, what to do?")
    new_card = Card.objects.create(
        word=json_data["word"],
        text="",
        tag=tag,
        user_notes=(json_data.get("user_notes") or None)
    )
    new_card.type.set(types)
    new_card.relate_words((json_data.get("related_words") or []))
    new_card.save()
    print(json_data)
    return JsonResponse({"card":new_card.card_data()})