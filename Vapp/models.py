from django.db import models
import uuid
from django.contrib.auth.models import AbstractUser
# Task model (Move it up to avoid circular import issues)
class Task(models.Model):
    T_ID = models.CharField(max_length=100, primary_key=True)  # Unique Task ID
    T_Name = models.CharField(max_length=255)  # Task Name
    T_Description = models.TextField()  # Task Description
    T_Priority_Level = models.CharField(max_length=50)  # Priority Level
    T_Status = models.BooleanField(default=False)  # Task Status (Completed or Not)
    T_Deadline = models.DateTimeField()  # Task Deadline
    T_Completed = models.BooleanField(default=False)  # Completion Status
    T_Total_Volunteers = models.IntegerField()  # Total Volunteers Needed

    # Relationships
    V_ID = models.ForeignKey('Volunteer', on_delete=models.CASCADE, related_name='tasks')  # Assigned Volunteer

    # JSON Fields for List Storage
    T_Volunteers = models.JSONField(default=list)  # List of Volunteer IDs

    def __str__(self):
        return self.T_Name


# Role model
class Role(models.Model):
    R_ID = models.CharField(max_length=100, primary_key=True)  # Unique Role ID
    R_Name = models.CharField(max_length=255, unique=True)  # Role Name
    R_Permissions = models.JSONField(default=list)  # Store as a list of permissions
    R_Description = models.TextField(blank=True, null=True)  # Optional description
    R_Created_At = models.DateTimeField(auto_now_add=True)  # Set when created
    R_Updated_At = models.DateTimeField(auto_now=True)  # Update on modification

    def __str__(self):
        return self.R_Name


# Volunteer model
class Volunteer(models.Model):
    V_ID = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)  # ✅ Always generates a UUID
    V_Name = models.CharField(max_length=255)
    V_Address = models.TextField()
    V_Status = models.BooleanField(default=False)
    V_Skills = models.JSONField(default=list, blank=True, null=True)  # ✅ Ensures a valid JSON format
    V_Availability = models.BooleanField(default=False)
    V_Email = models.EmailField(unique=True)
    V_Age = models.IntegerField(null=True, blank=True)
    V_Gender = models.CharField(max_length=50)
    V_Image_Urls = models.URLField(blank=True, null=True, default="")   # ✅ Make it optional
    V_Phone_No = models.CharField(max_length=15)
    
    # Relationships
    R_ID = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True)
    
    # List of Assigned Tasks (JSON field to store list)
    V_Assigned_Tasks = models.JSONField(default=list)

    def __str__(self):
        return self.V_Name


# Event model
class Event(models.Model):
    E_ID = models.CharField(max_length=100, primary_key=True)  # Unique Event ID
    E_Name = models.CharField(max_length=255)  # Event Name
    E_Description = models.TextField()  # Event Description
    E_Start_Date = models.DateTimeField()  # Start Date
    E_End_Date = models.DateTimeField()  # End Date
    E_Required_Volunteers = models.IntegerField(blank=True, null=True)  # Required Volunteers
    E_Assigned_Volunteers = models.IntegerField(default=0)  # Assigned Volunteers
    E_Completed = models.BooleanField(default=False)  # Completion Status
    E_Total_Tasks = models.IntegerField(blank=True, null=True)  # Total Tasks
    E_Location = models.TextField()  # Event Location (IP Address)

    # 
    # Relationships
    # V_ID = models.ForeignKey(Volunteer, on_delete=models.CASCADE, related_name='events',blank=True)
    # T_ID = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='event_tasks',blank=True)
    T_ID = models.ForeignKey(Task, on_delete=models.CASCADE, default=None,null=True,blank=True)  # Change '1' to a valid ID


    # Store as JSON (lists)
    E_Volunteers = models.JSONField(default=list,blank=True, null=True)  # List of Volunteer IDs
    E_Tasks = models.JSONField(default=list,blank=True, null=True)  # List of Task IDs
    E_Image_Urls = models.JSONField(default=list,blank=True, null=True)  # List of Image URLs

    def __str__(self):
        return self.E_Name


# Skill model
class Skill(models.Model):
    S_ID = models.CharField(max_length=100, primary_key=True)  # Unique Skill ID
    S_Name = models.JSONField(default=list)  # List of skill names
    S_Level = models.JSONField(default=list)  # List of skill levels
    V_ID = models.ForeignKey(Volunteer, on_delete=models.CASCADE, related_name='skills', null=True, blank=True)  # Relationship with Volunteer

    def __str__(self):
        return f"{self.S_ID} - {self.V_ID.V_Name if self.V_ID else 'Unassigned'}"


# Registration model
class Registration(models.Model):
    R_ID = models.CharField(max_length=100, unique=True)  # Unique Registration ID
    E_ID = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')  # Relationship with Event
    V_ID = models.ForeignKey(Volunteer, on_delete=models.CASCADE, related_name='registrations')  # Relationship with Volunteer

    def __str__(self):
        return f"Registration {self.R_ID} - {self.V_ID.V_Name} for {self.E_ID.E_Name}"
    



class CustomUser(AbstractUser):
    """
    Custom user model extending Django's AbstractUser.
    Fixes reverse accessor clashes by setting `related_name`
    for groups and user_permissions.
    """
    ROLE_CHOICES = [('admin', 'Admin'), ('volunteer', 'Volunteer')]
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    phone = models.CharField(max_length=15, blank=True, null=True)

    groups = models.ManyToManyField(
        "auth.Group",
        related_name="customuser_groups",  # ✅ Fixes conflict
        blank=True
    )

    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="customuser_permissions",  # ✅ Fixes conflict
        blank=True
    )

    def __str__(self):
        return self.username
