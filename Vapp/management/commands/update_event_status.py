from django.core.management.base import BaseCommand
from Vapp.models import Event  # Adjust to your actual event model
from django.utils import timezone

class Command(BaseCommand):
    help = "Update event status based on current date and time"

    def handle(self, *args, **kwargs):
        now = timezone.now()

        # Update events to "Ongoing" if the current time is within their range
        Event.objects.filter(E_Start_Date__lte=now, E_End_Date__gte=now).update(E_Status="Ongoing")

        # Update events to "Completed" if the end time has passed
        Event.objects.filter(E_End_Date__lt=now).update(E_Status="Completed")

        # Keep future events as "Upcoming"
        Event.objects.filter(E_Start_Date__gt=now).update(E_Status="Upcoming")

        self.stdout.write(self.style.SUCCESS("✅ Event statuses updated successfully!"))
