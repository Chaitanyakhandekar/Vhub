from django.urls import path
from .views import create_volunteer,delete_volunteer_by_phone,update_volunteer,get_volunteer_by_phone,create_event,update_event,delete_event,get_event_by_id,get_all_events,RegisterView, LoginView, LogoutView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, LoginView, LogoutView
from .views import get_user

urlpatterns = [
    path('volunteers/', create_volunteer, name="create_volunteer"),  # ✅ Correct plural form
    path('volunteers/delete/by-phone/<str:phone_no>/', delete_volunteer_by_phone, name="delete_volunteer_by_phone"),
    path('api/volunteers/get/by-phone/<str:phone_no>/', get_volunteer_by_phone, name='get_volunteer_by_phone'),
    path('api/volunteers/update/<str:phone_no>/', update_volunteer, name='update_volunteer'),
    
    
    # ✅ Event URLs
    path('event/', create_event, name="create_event"),  # ✅ This should exist
    path('event/<int:event_id>/', get_event_by_id, name="get_event_by_id"),
    path('event/update/<int:event_id>/', update_event, name="update_event"),
    path('api/event/delete/<str:event_id>/', delete_event, name="delete_event"),
    path('event/all/', get_all_events, name="get_all_events"),


    path("register/", RegisterView.as_view(), name="register"), 
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),  # ✅ JWT Login
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),  # ✅ Token Refresh
    path("logout/", LogoutView.as_view(), name="logout"),
    path('user/', get_user, name='get-user'),
]
