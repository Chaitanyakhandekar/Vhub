from django.contrib import admin
from .models import CustomUser
from .models import Volunteer, Role, Event, Task, Skill, Registration
from django.contrib.auth.admin import UserAdmin



class VolunteerAdmin(admin.ModelAdmin):
    list_display = ('V_ID','V_Name', 'V_Phone_No', 'V_Status', 'V_Availability', 'V_Age')
    
    search_fields = ('V_Name', 'V_Phone_No', 'V_Skills')
    list_filter = ('V_Status', 'V_Availability')
    list_display_links = ('V_Name',)  # ✅ Set 'V_Name' as a clickable link
    fieldsets = (  # ✅ Organize fields in the detail view
        ('Basic Information', {'fields': ('V_Name', 'V_Phone_No', 'V_Email', 'V_Gender', 'V_Age')}),
        ('Address', {'fields': ('V_Address',)}),
        ('Status & Skills', {'fields': ('V_Status', 'V_Skills', 'V_Availability')}),
    )

    list_editable = ('V_Status', 'V_Availability', 'V_Age','V_Phone_No')   # ✅ Enable inline editing in list view (Optional)

admin.site.register(Volunteer, VolunteerAdmin)

admin.site.register(Role)
admin.site.register(Event)
admin.site.register(Task)
admin.site.register(Skill)
admin.site.register(Registration)

admin.site.register(CustomUser, UserAdmin)  # ✅ Registers CustomUser in the admin panelSOR
