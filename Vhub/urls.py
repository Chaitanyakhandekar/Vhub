from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

def home(request):
    return JsonResponse({"message": "Welcome to Vhub API! Use /api/volunteers/ to interact."})  # ✅ Corrected URL

urlpatterns = [
    path('', home),  # ✅ Add homepage route
    path('admin/', admin.site.urls),
    path('api/', include('Vapp.urls')),
    
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)