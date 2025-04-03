# Generated by Django 5.2 on 2025-04-03 14:03

import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Vapp', '0026_user_gender'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='E_End_Date',
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name='event',
            name='E_End_Time',
            field=models.TimeField(default='17:00:00'),
        ),
        migrations.AlterField(
            model_name='event',
            name='E_Start_Date',
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name='event',
            name='E_Start_Time',
            field=models.TimeField(default='08:00:00'),
        ),
        migrations.CreateModel(
            name='Badge',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('icon', models.ImageField(upload_to='badge_icons/')),
                ('criteria', models.JSONField(default=dict)),
                ('event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='badges', to='Vapp.event')),
            ],
        ),
        migrations.CreateModel(
            name='EventPhoto',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('photo', models.ImageField(upload_to='event_gallery/')),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('is_approved', models.BooleanField(default=False)),
                ('event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='photos', to='Vapp.event')),
                ('uploaded_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UserBadge',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('earned_at', models.DateTimeField(auto_now_add=True)),
                ('metadata', models.JSONField(default=dict)),
                ('badge', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Vapp.badge')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='earned_badges', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'badge')},
            },
        ),
    ]
