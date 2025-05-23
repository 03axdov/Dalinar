# Generated by Django 4.2.16 on 2025-03-28 10:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0047_alter_model_accuracy_alter_model_loss_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='model',
            name='accuracy',
            field=models.JSONField(blank=True, default=list, null=True),
        ),
        migrations.AlterField(
            model_name='model',
            name='loss',
            field=models.JSONField(blank=True, default=list, null=True),
        ),
        migrations.AlterField(
            model_name='model',
            name='val_accuracy',
            field=models.JSONField(blank=True, default=list, null=True),
        ),
        migrations.AlterField(
            model_name='model',
            name='val_loss',
            field=models.JSONField(blank=True, default=list, null=True),
        ),
    ]
