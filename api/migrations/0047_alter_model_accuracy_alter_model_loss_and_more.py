# Generated by Django 4.2.16 on 2025-03-27 17:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0046_remove_model_trained_accuracy_model_accuracy_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='model',
            name='accuracy',
            field=models.JSONField(default=list, null=True),
        ),
        migrations.AlterField(
            model_name='model',
            name='loss',
            field=models.JSONField(default=list, null=True),
        ),
        migrations.AlterField(
            model_name='model',
            name='val_accuracy',
            field=models.JSONField(default=list, null=True),
        ),
        migrations.AlterField(
            model_name='model',
            name='val_loss',
            field=models.JSONField(default=list, null=True),
        ),
    ]
