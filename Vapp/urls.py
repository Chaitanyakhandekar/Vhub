from django.urls import path
from .views import (
    signup, login_view, logout_view, get_users, get_volunteers, get_user_by_id,
    get_events, create_event, update_event, delete_event, get_event_by_id,
    get_tasks, create_task, update_task, delete_task, get_task_by_id,
    record_attendance, get_attendance, register_for_event, assign_event_role, get_attendance_rate, serve_image,
    check_registration_status, LeaveEventView, generate_qr_code_view, scan_qr_code,post_announcement,get_sample_task,update_user_role
    ,assign_task, self_assign_task ,update_task_status,get_all_registrations,contact_us,send_otp,verify_otp,send_signup_otp,verify_signup_otp,get_profile,scan_qr_code,
    qr_scan_result_view,update_user,update_event_role,get_my_events,check_certificate, download_certificate,generate_certificate,get_notifications,mark_notifications_as_read
    
)
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    # Authentication URLs
    path('auth/signup/', signup, name='signup'),
    path('auth/login/', login_view, name='login'),
    path('auth/logout/', logout_view, name='logout'),
    path("auth/send-otp/", send_otp, name="send_otp"),
    path("auth/verify-otp/", verify_otp, name="verify_otp"),
    path("auth/send-signup-otp/", send_signup_otp, name="send_signup_otp"),
    path("auth/verify-signup-otp/", verify_signup_otp, name="verify_signup_otp"),

    # User Management URLs
    path('users/', get_users, name='get_users'),
    path('users/<uuid:user_id>/', get_user_by_id, name='get_user_by_id'),
    path('volunteers/', get_volunteers, name='get_volunteers'),
    path('users/update-role/<uuid:user_id>/', update_user_role, name="update_user_role"),
    path('users/profile/', get_profile, name="get_profile"),
    path('users/<uuid:user_id>/update/', update_user, name='update_user'),


    
    # Event Management URLs
    path('events/', get_events, name='get_events'),
    path('my-events/', get_my_events, name='my-events'),
    path('events/create/', create_event, name='create_event'),
    path("events/<uuid:E_ID>/update/", update_event, name="update-event"),
    path('events/<uuid:E_ID>/', get_event_by_id, name='get_event_by_id'),
    path('events/<uuid:E_ID>/delete/', delete_event, name='delete_event'),
    path('events/<uuid:E_ID>/register/', register_for_event, name='register_for_event'),
    path("registrations/", get_all_registrations, name="get_all_registrations"),
    path('events/<uuid:E_ID>/assign-role/', assign_event_role, name='assign_event_role'),
    path('events/<uuid:E_ID>/registration-status/', check_registration_status, name='event_registration_status'),
    path('events/<uuid:E_ID>/leave/', LeaveEventView.as_view(), name='leave_event'),
    path("events/<uuid:E_ID>/update-role/", update_event_role, name="update_event_role"),

    path("events/<uuid:E_ID>/generate-qr/", generate_qr_code_view, name="generate_qr_code"),
    path("qr/scan/", scan_qr_code, name="scan_qr_code"),
    path("qr/scan-result/", qr_scan_result_view, name="qr_scan_result"),  # ✅ New API
    # Announcements
    path("events/<uuid:event_id>/announcement/", post_announcement, name="post_announcement"),
    path("notifications/", get_notifications, name="get_notifications"),
    path("notifications/mark-as-read/", mark_notifications_as_read, name="mark_notifications_as_read"),

    path("events/<uuid:E_ID>/check-certificate/", check_certificate, name="check_certificate"),
    path("events/<uuid:E_ID>/download-certificate/", download_certificate, name="download_certificate"),
    path("events/<uuid:E_ID>/generate-certificate/", generate_certificate, name="generate_certificate"),

    # Sample Task
    path("events/<uuid:E_ID>/sample-task/", get_sample_task, name="get_sample_task"),



    # Serve Images
    path('serve-image/<path:path>/', serve_image, name='serve_image'),

    # Task Management URLs
    path('tasks/update/<uuid:T_ID>/', update_task, name='update_task'),
    path('tasks/<uuid:T_ID>/', get_task_by_id, name='get_task_by_id'),
    path('tasks/delete/<uuid:T_ID>/', delete_task, name='delete_task'),
    path("events/<uuid:E_ID>/tasks/", get_tasks, name="get_tasks"),
    path("events/<uuid:E_ID>/tasks/create/", create_task, name="create_task"),
    path("tasks/<uuid:task_id>/assign/", assign_task, name="assign_task"),
    path("tasks/<uuid:task_id>/self-assign/", self_assign_task, name="self_assign_task"),
    path("tasks/<uuid:task_id>/update-status/", update_task_status, name="update_task_status"),


    # Attendance Management URLs
    path('attendance/record/', record_attendance, name='record_attendance'),
    path('attendance/<uuid:E_ID>/', get_attendance, name='get_attendance'),
    path('attendance/rate/', get_attendance_rate, name='get_attendance_rate'),
    
    
    # Sending Email Urls
    path('contact-us/', contact_us, name='contact_us'),  # Ensure this matches frontend API call
]

# Serving Media & Static Files
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


