# Generated by Django 4.2.16 on 2025-02-19 15:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0020_model_loss_function_model_optimizer'),
    ]

    operations = [
        migrations.CreateModel(
            name='RandomFlipLayer',
            fields=[
                ('layer_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='api.layer')),
                ('mode', models.CharField(choices=[('horizontal_and_vertical', 'horizontal_and_vertical'), ('horizontal', 'horizontal'), ('vertical', 'vertical')], default='horizontal_and_vertical', max_length=100)),
            ],
            options={
                'abstract': False,
                'base_manager_name': 'objects',
            },
            bases=('api.layer',),
        ),
    ]
