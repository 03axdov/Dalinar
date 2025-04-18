# Generated by Django 4.2.16 on 2025-02-17 18:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_alter_layer_model'),
    ]

    operations = [
        migrations.CreateModel(
            name='Rescaling',
            fields=[
                ('layer_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='api.layer')),
                ('scale', models.FloatField()),
                ('offset', models.FloatField()),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
            bases=('api.layer',),
        ),
    ]
