# Generated by Django 4.2.16 on 2025-03-28 11:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0049_textvectorizationlayer_output_sequence_length'),
    ]

    operations = [
        migrations.AlterField(
            model_name='textvectorizationlayer',
            name='output_sequence_length',
            field=models.PositiveIntegerField(default=256),
        ),
    ]
