# Generated by Django 4.2.16 on 2025-04-21 11:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0065_mobilenetv2layer_alter_dataset_image_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='model',
            name='output_type',
            field=models.CharField(blank=True, choices=[('classification', 'Classification'), ('regression', 'Regression')], default='Classification', max_length=20, null=True),
        ),
    ]
