from django.db import models

# Create your models here.

class Card(models.Model):
    word = models.TextField(max_length=100)
    text = models.TextField()
    tag = models.ForeignKey("cards.Tag",on_delete=models.CASCADE)
    type = models.ManyToManyField("cards.Word_type")
    studied = models.IntegerField(default=0)
    user_notes = models.TextField(null=True, blank=True)
    related_words = models.ManyToManyField("cards.Card")
    reliability = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.word} ({', '.join(self.type.values_list('name',flat=True))}): {self.text[0:40]}..."
    
    def type_string(self):
        return ", ".join([each.name for each in self.type.all()])
    
    def card_data(self):
        return {"id":self.id,
            "text":self.text,
            "studied":self.studied,
            "word":self.word,
            "type":", ".join(self.type.values_list("name",flat=True)),
            "user_notes": self.user_notes,
            "relatedWords":list(self.related_words.values("id","word","tag__id"))+list(self.card_set.values("id","word","tag__id"))+list(self.other_related_words_set.values("word"))
        }
    
    def relate_words(self,words):
        self.card_set.clear()
        self.related_words.clear()
        self.other_related_words_set.all().delete()
        if words:
            for word in [word.strip()[0].upper()+word.strip()[1:].lower() for word in words.split(',') if word.strip()]:
                find_card = Card.objects.filter(word=word).first()
                if find_card:
                    self.related_words.add(find_card)
                else:
                    self.other_related_words_set.create(word=word)

class Tag(models.Model):
    name = models.TextField(max_length=80)

class Word_type(models.Model):
    name = models.TextField(max_length=30)

class Other_related_words(models.Model):
    word = models.TextField(max_length=100)
    card = models.ForeignKey("cards.Card",on_delete=models.CASCADE)

