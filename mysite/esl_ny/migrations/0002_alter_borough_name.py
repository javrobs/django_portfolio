# Generated by Django 4.1 on 2024-08-16 20:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('esl_ny', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='borough',
            name='name',
            field=models.CharField(max_length=20),
        ),
    ]
