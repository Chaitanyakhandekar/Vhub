from rest_framework.decorators import api_view, permission_classes,parser_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Event, Task, Attendance,Registration,SampleTask,EventAnnouncement,QRCode,EventCertificate, EventPhoto, Badge, UserBadge
from .serializers import (
    UserSerializer, SignupSerializer, LoginSerializer,
    EventSerializer, TaskSerializer, AttendanceSerializer,RegistrationSerializer,EventAnnouncementSerializer
    ,SampleTaskSerializer,EventPhotoSerializer, BadgeSerializer
)
from django.contrib.auth.hashers import make_password
import random
from Vapp.models import OTPVerification
from django.http import FileResponse, Http404
import os
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import JsonResponse
import json
import base64
from django.views.decorators.csrf import csrf_exempt
import qrcode
from datetime import datetime, timedelta
from django.utils.crypto import get_random_string
from django.conf import settings  # ✅ Fix: Import settings
from django.utils.timezone import now
from django.db.models import Q
from django.http import HttpResponse
from django.template.loader import render_to_string
import pdfkit
from reportlab.pdfgen import canvas
from django.http import FileResponse
from PIL import Image, ImageDraw, ImageFont
from PIL import ImageFont
title_font = ImageFont.load_default()
from django.core.exceptions import ObjectDoesNotExist
from reportlab.lib.pagesizes import landscape, letter
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from io import BytesIO
from PyPDF2 import PdfReader, PdfWriter
from django.http import HttpRequest
import textwrap 
from .models import Event, EventAnnouncement, Notification
from .serializers import EventAnnouncementSerializer, NotificationSerializer
import logging
from django.db import transaction
from django.utils import timezone
from django.core.files.storage import default_storage
from datetime import time
from rest_framework import generics, status, permissions
from django.db.models.signals import post_save
from django.dispatch import receiver

def get_fonts():
    """ Returns the correct fonts based on OS (Windows or Linux) """
    
    # Font selection based on OS
    if platform.system() == "Windows":
        FONT_PATH_BOLD = "C:/Windows/Fonts/arialbd.ttf"  # Windows path (Bold Arial)
        FONT_PATH_REGULAR = "C:/Windows/Fonts/Arial.ttf"  # Windows path (Regular Arial)
    else:
        FONT_PATH_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"  # Linux (Render) path (Bold)
        FONT_PATH_REGULAR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"  # Linux (Render) path (Regular)

    try:
        name_font = ImageFont.truetype(FONT_PATH_BOLD, 50)
        details_font = ImageFont.truetype(FONT_PATH_REGULAR, 30)
    except OSError:
        print("❌ Font not found! Using default PIL font.")
        name_font = ImageFont.load_default()
        details_font = ImageFont.load_default()

    return name_font, details_font  # Return both fonts

# FONT_PATH_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
# FONT_PATH_REGULAR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
# font_path_bold = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
# font_path_regular = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"


# name_font = ImageFont.truetype(font_path_bold, 50)
# details_font = ImageFont.truetype(font_path_regular, 30)

logger = logging.getLogger(__name__)
User = get_user_model()  # noqa: F811

### ------------------- AUTHENTICATION VIEWS ------------------- ###

# 🔹 Send OTP View
@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp(request):
    """
    Generates and sends an OTP to the user's email.
    """
    email = request.data.get("email")
    
    try:
        user = User.objects.get(email=email)
        otp = random.randint(100000, 999999)  # ✅ Generate a 6-digit OTP

        # ✅ Save OTP to the database
        OTPVerification.objects.update_or_create(
            user=user, defaults={"otp": otp}
        )

        # ✅ Send OTP via email
        send_mail(
            subject="Your OTP Code",
            message=f"Your OTP code is: {otp}",
            from_email="vcoders04@gmail.com",
            recipient_list=[email],
            fail_silently=False,
        )

        return Response({"message": "OTP sent successfully!"}, status=status.HTTP_200_OK)
    
    except User.DoesNotExist:
        return Response({"error": "User with this email does not exist!"}, status=status.HTTP_404_NOT_FOUND)

# 🔹 Verify OTP View
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    """
    Verifies the OTP entered by the user.
    """
    email = request.data.get("email")
    entered_otp = request.data.get("otp")

    try:
        user = User.objects.get(email=email)
        otp_record = OTPVerification.objects.filter(user=user).first()

        if otp_record and str(otp_record.otp) == entered_otp:
            otp_record.delete()  # ✅ Remove OTP after successful verification
            return Response({"message": "OTP verified successfully!"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid OTP!"}, status=status.HTTP_400_BAD_REQUEST)

    except User.DoesNotExist:
        return Response({"error": "User not found!"}, status=status.HTTP_404_NOT_FOUND)

# 🔹 Signup View (Unchanged)
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    try:
        print("📩 Received Signup Data:", request.data)  # ✅ Debugging line
        serializer = SignupSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
        
        print("❌ Serializer Errors:", serializer.errors)  # ✅ Debugging line
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        print("❌ Signup Error:", str(e))
        return Response({"error": "Something went wrong on the server."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# 🔹 Send OTP on Signup
@api_view(['POST'])
@permission_classes([AllowAny])
def send_signup_otp(request):
    email = request.data.get("email")

    if not email:
        return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

    # ✅ Generate 6-digit OTP
    otp_code = str(random.randint(100000, 999999))

    # ✅ Create a temporary user entry OR update OTP if user exists
    user, created = User.objects.get_or_create(email=email, defaults={"name": "TempUser"})
    OTPVerification.objects.update_or_create(user=user, defaults={"otp": otp_code})

    # ✅ Send OTP via email
    try:
        send_mail(
            "Your OTP for Signup",
            f"Your OTP is {otp_code}. It is valid for 10 minutes.",
            "no-reply@vhub.com",
            [email],
            fail_silently=False,
        )
    except Exception as e:
        return Response({"error": f"Failed to send OTP: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({"message": "OTP sent successfully!"}, status=status.HTTP_200_OK)
# 🔹 Verify OTP and Complete Signup
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_signup_otp(request):
    """
    Verifies the OTP and completes the user registration.
    """
    email = request.data.get("email")
    entered_otp = request.data.get("otp")
    name = request.data.get("name")
    password = request.data.get("password")
    role = request.data.get("role", "Volunteer")  # Default role

    try:
        otp_record = OTPVerification.objects.filter(email=email).first()

        if otp_record and str(otp_record.otp) == entered_otp:
            otp_record.delete()  # ✅ Remove OTP after verification

            # ✅ Create the user
            user = User.objects.create_user(email=email, name=name, password=password, role=role)
            return Response({"message": "Signup successful!"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": "Invalid OTP!"}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# 🔹 Login View (Unchanged)
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    user = authenticate(email=email, password=password)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": user.role  # ✅ Return role so frontend can redirect
        }, status=status.HTTP_200_OK)
    
    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

# 🔹 Logout View (Unchanged)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)




### ------------------- USER MANAGEMENT ------------------- ###

# Get All Users
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_user(request, user_id):
    user = get_object_or_404(User, id=user_id)

    if request.user != user:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    user.name = request.data.get("name", user.name)
    user.phone = request.data.get("phone", user.phone)
    user.college_name = request.data.get("college_name", user.college_name)
    user.faculty = request.data.get("faculty", user.faculty)
    user.year_of_study = request.data.get("year_of_study", user.year_of_study)

    if "profile_image" in request.FILES:
        user.profile_image = request.FILES["profile_image"]

    user.save()

    return Response(
        {"message": "Profile updated successfully!", "user": UserSerializer(user, context={"request": request}).data},
        status=status.HTTP_200_OK
    )
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user_role(request, user_id):
    """
    Update a user's role (Admin-only access).
    """
    if request.user.role != "Admin":
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    user = get_object_or_404(User, id=user_id)
    new_role = request.data.get("role")

    valid_roles = ["Volunteer", "Event Organizer", "Admin","Coordinator","Super Volunteer"]
    if new_role not in valid_roles:
        return Response({"error": "Invalid role"}, status=status.HTTP_400_BAD_REQUEST)

    user.role = new_role
    user.save()
    
    return Response({"message": f"User role updated to {new_role}"}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_volunteers(request):
    volunteers = User.objects.filter(role="Volunteer")  # ✅ Only fetch volunteers
    serializer = UserSerializer(volunteers, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# Get User by ID
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_by_id(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found!"}, status=status.HTTP_404_NOT_FOUND)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_profile(request):
    serializer = UserSerializer(request.user, context={"request": request})
    return Response(serializer.data, status=status.HTTP_200_OK)




### ------------------- EVENT MANAGEMENT ------------------- ###

# Get All Events
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_events(request):
    events = Event.objects.all()
    
    # Ensure an empty list is returned instead of an object with a message
    if not events.exists():
        return Response([], status=status.HTTP_200_OK)

    serializer = EventSerializer(events, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

#get my events
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_my_events(request):
    """Fetch events where the logged-in user is a creator, volunteer, coordinator, or super volunteer."""
    user = request.user  

    # Get events where the user is involved
    my_events = Event.objects.filter(
        Q(E_Created_By=user) | 
        Q(E_Volunteers=user) | 
        Q(E_Coordinators=user) | 
        Q(E_Super_Volunteers=user)
    ).distinct()

    serializer = EventSerializer(my_events, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Register for an Event
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def register_for_event(request, E_ID):
    user = request.user  # ✅ Ensure user is authenticated
    event = get_object_or_404(Event, E_ID=E_ID)  # ✅ Ensure event exists

    # ✅ Check if user is already registered
    if Registration.objects.filter(event=event, volunteer=user).exists():
        return Response({"error": "Already registered"}, status=status.HTTP_400_BAD_REQUEST)

    # ✅ Register user
    registration = Registration.objects.create(event=event, volunteer=user)
    
    return Response(
        {"message": "Successfully registered", "qr_code": registration.qr_code.url},
        status=status.HTTP_201_CREATED
    )
    

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_all_registrations(request):
    """Fetch all registrations with event and volunteer details"""
    registrations = Registration.objects.all()
    
    if not registrations.exists():
        return Response({"message": "No registrations found"}, status=status.HTTP_200_OK)

    serializer = RegistrationSerializer(registrations, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


#Check Registration Status
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_registration_status(request, E_ID):
    """Check if the user is registered for an event."""
    user = request.user
    event = get_object_or_404(Event, E_ID=E_ID)  # ✅ Use the correct Event primary key field

    # ✅ Check if the user is registered in the Registration model
    is_registered = Registration.objects.filter(event=event, volunteer=user).exists()

    return Response({"registered": is_registered}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_registration(request, E_ID):
    try:
        event = get_object_or_404(Event, E_ID=E_ID)
        is_registered = Registration.objects.filter(
            event=event,
            volunteer=request.user
        ).exists()
        
        return Response({
            "registered": is_registered,
            "event_id": E_ID,
            "user_id": request.user.id
        }, status=200)
        
    except Exception as e:
        return Response({
            "error": str(e)
        }, status=400)


# Leave Event
class LeaveEventView(APIView):
    def post(self, request, E_ID):
        try:
            # Get the event
            event = get_object_or_404(Event, E_ID=E_ID)
            user = request.user  # Get the logged-in user
            
            # Check if the user is registered for the event
            registration = Registration.objects.filter(event=event, volunteer=user).first()
            if registration:
                registration.delete()  # Remove registration
                return Response({"message": "Successfully left the event"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "User is not registered for this event"}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Get Event by ID
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_event_by_id(request, E_ID):
    event = get_object_or_404(Event, E_ID=E_ID)
    serializer = EventSerializer(event, context={"request": request})
    return Response(serializer.data, status=status.HTTP_200_OK)





# Create Event
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_event(request):
    serializer = EventSerializer(data=request.data)
    if serializer.is_valid():
        # Set default times if not provided
        if 'E_Start_Time' not in serializer.validated_data:
            serializer.validated_data['E_Start_Time'] = '08:00:00'
        if 'E_End_Time' not in serializer.validated_data:
            serializer.validated_data['E_End_Time'] = '17:00:00'
            
        serializer.save(E_Created_By=request.user)
        return Response({"message": "Event created successfully!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_event(request, E_ID):
    try:
        event = Event.objects.get(E_ID=E_ID)
    except Event.DoesNotExist:
        return Response({"error": "Event not found!"}, status=status.HTTP_404_NOT_FOUND)

    # Handle coordinators
    if 'E_Coordinators' in request.data:
        try:
            coordinators = request.data.getlist('E_Coordinators')
            event.E_Coordinators.clear()
            for coordinator_id in coordinators:
                user = User.objects.get(id=coordinator_id)
                event.E_Coordinators.add(user)
        except Exception as e:
            return Response({"error": f"Invalid coordinator data: {str(e)}"}, status=400)

    # Handle super volunteers
    if 'E_Super_Volunteers' in request.data:
        try:
            super_volunteers = request.data.getlist('E_Super_Volunteers')
            event.E_Super_Volunteers.clear()
            for volunteer_id in super_volunteers:
                user = User.objects.get(id=volunteer_id)
                event.E_Super_Volunteers.add(user)
        except Exception as e:
            return Response({"error": f"Invalid super volunteer data: {str(e)}"}, status=400)

    # Handle other fields
    serializer = EventSerializer(event, data=request.data, partial=True, context={"request": request})

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Event updated successfully!"}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Delete Event
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])  # Ensure only logged-in users can delete
def delete_event(request, E_ID):
    event = get_object_or_404(Event, E_ID=E_ID)

    # ✅ Debugging: Print user details
    print("User trying to delete:", request.user)
    print("Event created by:", event.E_Created_By)

    # ✅ Check if the user is either the event creator OR an Admin
    if request.user != event.E_Created_By and request.user.role != "Admin":
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    event.delete()
    return Response({"message": "Event deleted successfully!"}, status=status.HTTP_200_OK)


# Assign Event Role
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assign_event_role(request, E_ID):
    """Assigns a user as Coordinator, Super Volunteer, or resets to default Volunteer."""
    event = get_object_or_404(Event, E_ID=E_ID)

    # ✅ Only Admins & Event Creators can assign roles
    if request.user != event.E_Created_By and request.user.role != "Admin":
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    user_id = request.data.get("user_id")
    role = request.data.get("role")

    if not user_id or not role:
        return Response({"error": "User ID and role are required."}, status=status.HTTP_400_BAD_REQUEST)

    user = get_object_or_404(User, id=user_id)

    # ✅ Assign or Remove Role
    if role == "Coordinator":
        event.E_Coordinators.add(user)
        message = f"{user.name} assigned as Coordinator successfully!"
    elif role == "Super Volunteer":
        event.E_Super_Volunteers.add(user)
        message = f"{user.name} assigned as Super Volunteer successfully!"
    elif role == "Volunteer":
        # ✅ Remove user from both Coordinator & Super Volunteer roles
        event.E_Coordinators.remove(user)
        event.E_Super_Volunteers.remove(user)
        message = f"{user.name} is now a regular Volunteer."
    else:
        return Response({"error": "Invalid event role"}, status=status.HTTP_400_BAD_REQUEST)

    event.save()
    return Response({"message": message}, status=status.HTTP_200_OK)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_event_role(request, E_ID):
    """Updates a volunteer's event-specific role or resets them to Volunteer."""
    try:
        user_id = request.data.get("user_id")
        new_role = request.data.get("role")

        if not user_id or not new_role:
            return Response({"error": "User ID and role are required."}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Find the registration entry for this event
        registration = Registration.objects.filter(event__E_ID=E_ID, volunteer__id=user_id).first()

        if not registration:
            return Response({"error": "User is not registered for this event."}, status=status.HTTP_404_NOT_FOUND)

        # ✅ Only Admins & Event Organizers can update roles
        event = registration.event
        if request.user != event.E_Created_By and request.user.role != "Admin":
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        # ✅ Update or Reset Role
        if new_role in ["Coordinator", "Super Volunteer"]:
            registration.role = new_role
        elif new_role == "Volunteer":
            registration.role = "Volunteer"
            event.E_Coordinators.remove(registration.volunteer)
            event.E_Super_Volunteers.remove(registration.volunteer)
        else:
            return Response({"error": "Invalid role"}, status=status.HTTP_400_BAD_REQUEST)

        registration.save()  # ✅ Save the role change
        event.save()  # ✅ Ensure event updates

        return Response({"message": f"Role updated successfully to {new_role}"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": f"Internal Server Error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Serve Image (For Debugging)
def serve_image(request, path):
    file_path = os.path.abspath(path)
    if os.path.exists(file_path):
        return FileResponse(open(file_path, 'rb'))
    else:
        raise Http404("Image not found")
    
class EventBadgesAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, E_ID):
        badges = Badge.objects.filter(event_id=E_ID)
        serializer = BadgeSerializer(badges, many=True, context={'request': request})
        return Response({'badges': serializer.data}, status=status.HTTP_200_OK)

class AwardBadgeAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, E_ID, badge_id):
        try:
            badge = Badge.objects.get(id=badge_id, event_id=E_ID)
            user = request.user
            
            if UserBadge.objects.filter(user=user, badge=badge).exists():
                return Response(
                    {'message': 'User already has this badge'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            UserBadge.objects.create(user=user, badge=badge)
            return Response(
                {'message': 'Badge awarded successfully'},
                status=status.HTTP_201_CREATED
            )
        except Badge.DoesNotExist:
            return Response(
                {'message': 'Badge not found'},
                status=status.HTTP_404_NOT_FOUND
            )

class EventGalleryAPIView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, E_ID):
        photos = EventPhoto.objects.filter(event_id=E_ID, is_approved=True)
        serializer = EventPhotoSerializer(photos, many=True, context={'request': request})
        return Response({'photos': serializer.data}, status=status.HTTP_200_OK)
    
    def post(self, request, E_ID):
        try:
            event = Event.objects.get(E_ID=E_ID)
            photo = request.FILES.get('photo')
            
            if not photo:
                return Response(
                    {'error': 'No photo provided'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # For local storage
            photo_instance = EventPhoto.objects.create(
                event=event,
                photo=photo,
                uploaded_by=request.user,
                is_approved=request.user.role in ['Admin', 'Coordinator']
            )
            
            return Response(
                {'message': 'Photo uploaded successfully'},
                status=status.HTTP_201_CREATED
            )
        except Event.DoesNotExist:
            return Response(
                {'error': 'Event not found'},
                status=status.HTTP_404_NOT_FOUND
            )
            
@receiver(post_save, sender=Attendance)
def check_badge_conditions(sender, instance, created, **kwargs):
    if created:
        user = instance.user
        event = instance.event
        
        # Example: Award participation badge
        participation_badge = Badge.objects.filter(
            event=event,
            criteria__type='participation'
        ).first()
        
        if participation_badge and not UserBadge.objects.filter(user=user, badge=participation_badge).exists():
            UserBadge.objects.create(user=user, badge=participation_badge)



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def generate_qr_code_view(request, E_ID):
    try:
        print(f"🟡 Debug: Generating QR for Event ID {E_ID}, User: {request.user}")

        event = get_object_or_404(Event, E_ID=E_ID)
        registration, created = Registration.objects.get_or_create(event=event, volunteer=request.user)

        print(f"🟢 Debug: Registration Entry - Created: {created}, QR Exists: {registration.qr_code}")

        # ✅ Set QR Code expiration time (e.g., 24 hours from now)
        expiration_time = datetime.now() + timedelta(hours=24)

        # ✅ Ensure QR Code is saved in the QRCode Table with an expiration time
        qr_code_entry, qr_created = QRCode.objects.get_or_create(
            volunteer=request.user,
            event=event,
            defaults={"used": False, "expires_at": expiration_time}  # ✅ Set default expiration
        )

        print(f"✅ Debug: QR Code Entry Found: {qr_code_entry}, Created: {qr_created}")

        # ✅ Generate QR Code Data
        raw_data = {
            "volunteer_id": str(request.user.id),
            "E_ID": str(event.E_ID),
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "nonce": get_random_string(16)
        }
        encoded_data = base64.b64encode(json.dumps(raw_data).encode()).decode()

        frontend_url = f"http://192.168.1.5:5173/qr/scan-result?qr_data={encoded_data}"
        print(f"🔍 DEBUG: QR Code Redirect URL → {frontend_url}")

        # ✅ Generate and Save New QR Code Image
        qr = qrcode.make(frontend_url)
        qr_directory = os.path.join(settings.MEDIA_ROOT, "qrcodes/")
        os.makedirs(qr_directory, exist_ok=True)

        qr_image_filename = f"qr_{request.user.id}_{event.E_ID}.png"
        qr_image_path = os.path.join(qr_directory, qr_image_filename)
        qr.save(qr_image_path)

        # ✅ Ensure qr_code is saved
        registration.qr_code = f"qrcodes/{qr_image_filename}"
        registration.save()

        qr_code_entry.image_path = registration.qr_code
        qr_code_entry.expires_at = expiration_time  # ✅ Save expiration time
        qr_code_entry.save()

        qr_code_url = request.build_absolute_uri(settings.MEDIA_URL + str(registration.qr_code))
        print(f"✅ Debug: QR Code Successfully Generated - URL: {qr_code_url}")

        return JsonResponse({
            "message": "🎉 QR Code generated successfully!",
            "qr_code_url": qr_code_url
        }, status=200)

    except Exception as e:
        print(f"❌ Debug: ERROR in generate_qr_code_view: {str(e)}")
        return JsonResponse({"error": f"Internal Server Error: {str(e)}"}, status=500)







@api_view(["GET"])  # ✅ Handles QR Code Scan Result
@permission_classes([IsAuthenticated])
def qr_scan_result_view(request):
    """
    ✅ Handles QR Code scan result:
    - Extracts encoded QR data from the URL
    - Decodes and verifies the data
    - Returns volunteer and event details
    """
    try:
        # ✅ Extract qr_data from query parameters
        qr_data = request.GET.get("qr_data", "")
        if not qr_data:
            return JsonResponse({"error": "QR data is missing"}, status=400)

        # ✅ Decode the base64 encoded QR data
        decoded_data = base64.b64decode(qr_data).decode()
        qr_info = json.loads(decoded_data)

        # ✅ Extract volunteer_id and E_ID
        volunteer_id = qr_info.get("volunteer_id")
        E_ID = qr_info.get("E_ID")
        timestamp = qr_info.get("timestamp")

        if not volunteer_id or not E_ID:
            return JsonResponse({"error": "Invalid QR Code data"}, status=400)

        # ✅ Verify that QR code is not expired
        qr_time = datetime.strptime(timestamp, "%Y-%m-%d %H:%M:%S")
        if now() > qr_time:
            return JsonResponse({"error": "QR Code has expired."}, status=400)

        # ✅ Fetch volunteer and event details
        volunteer = get_object_or_404(User, id=volunteer_id)
        event = get_object_or_404(Event, E_ID=E_ID)

        # ✅ Check if this QR code exists in the database
        qr_entry = QRCode.objects.filter(volunteer=volunteer, event=event).first()
        if not qr_entry:
            return JsonResponse({"error": "Invalid QR Code"}, status=400)

        if qr_entry.used:
            return JsonResponse({"error": "This QR Code has already been used."}, status=400)

        # ✅ Mark QR Code as used (if applicable)
        qr_entry.used = True
        qr_entry.save()

        # ✅ Prepare response data
        volunteer_details = {
            "name": volunteer.name,
            "email": volunteer.email,
            "phone": volunteer.phone,
            "college": volunteer.college_name,
            "faculty": volunteer.faculty,
            "event_name": event.E_Name,
            "event_location": event.E_Location,
            "event_date": f"{event.E_Start_Date} - {event.E_End_Date}",
            "profile_picture": request.build_absolute_uri(volunteer.profile_image.url) if volunteer.profile_image else None
        }

        return JsonResponse({"success": True, "volunteer_details": volunteer_details})

    except Exception as e:
        return JsonResponse({"error": f"Server error: {str(e)}"}, status=500)

@api_view(['POST'])
@permission_classes([AllowAny])
def scan_qr_code(request):
    try:
        encoded_data = request.data.get("qr_data")
        print(f"🔍 Debug: Received QR Data → {encoded_data}")  # ✅ Debugging line

        if not encoded_data:
            return JsonResponse({"error": "QR data is missing or invalid."}, status=400)

        # ✅ Decode the QR data
        try:
            decoded_data = base64.b64decode(encoded_data).decode()
            qr_info = json.loads(decoded_data)
            print(f"✅ Debug: Decoded QR Data → {qr_info}")  # ✅ Debugging line
        except (ValueError, json.JSONDecodeError) as e:
            print(f"❌ QR Decoding Error: {str(e)}")
            return JsonResponse({"error": "Invalid QR Code data format."}, status=400)

        volunteer_id = qr_info.get("volunteer_id")
        E_ID = qr_info.get("E_ID")

        qr_entry = QRCode.objects.filter(volunteer__id=volunteer_id, event__E_ID=E_ID).first()
        if not qr_entry:
            print("❌ Debug: QR Code does not exist in DB.")
            return JsonResponse({"error": "Invalid QR Code."}, status=400)

        if qr_entry.used:
            return JsonResponse({"error": "This QR Code has already been used."}, status=400)

        if qr_entry.is_expired():
            return JsonResponse({"error": "QR Code has expired."}, status=400)

        # ✅ Mark QR as used
        qr_entry.used = True
        qr_entry.save()

        volunteer = get_object_or_404(User, id=volunteer_id)
        event = qr_entry.event

        volunteer_details = {
            "name": volunteer.name,
            "faculty": volunteer.faculty,
            "college": volunteer.college_name,
            "event_name": event.E_Name,
            "profile_picture": request.build_absolute_uri(volunteer.profile_image.url) if volunteer.profile_image else None
        }

        print(f"✅ QR Code Verified for {volunteer.name} at {event.E_Name}")

        return JsonResponse({"success": True, "volunteer_details": volunteer_details})

    except Exception as e:
        print(f"❌ Unexpected Error in scan_qr_code: {str(e)}")
        return JsonResponse({"error": f"Internal Server Error: {str(e)}"}, status=500)




### ------------------- TASK MANAGEMENT ------------------- ###
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_sample_task(request, E_ID):
    event = get_object_or_404(Event, E_ID=E_ID)
    sample_task = SampleTask.objects.filter(event=event).first()

    if not sample_task:
        return Response({"message": "No sample task available."}, status=status.HTTP_200_OK)

    serializer = SampleTaskSerializer(sample_task)
    return Response(serializer.data, status=status.HTTP_200_OK)


# Get All Tasks
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_tasks(request, E_ID):
    event = get_object_or_404(Event, E_ID=E_ID)  # Ensure event exists
    
    if request.user.role != "Admin" and request.user.role != "Volunteer" and request.user not in event.E_Coordinators.all() and request.user != event.E_Created_By:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    tasks = Task.objects.filter(event=event)
    
    if not tasks.exists():
        return Response({"message": "No tasks found for this event"}, status=status.HTTP_200_OK)

    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



# Get Task by ID
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_task_by_id(request, T_ID):
    try:
        task = Task.objects.get(T_ID=T_ID)
        serializer = TaskSerializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Task.DoesNotExist:
        return Response({"error": "Task not found!"}, status=status.HTTP_404_NOT_FOUND)

# Create Task
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_task(request, E_ID):  # ✅ Use E_ID instead of E_ID
    event = get_object_or_404(Event, E_ID=E_ID)  # Ensure event exists

    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(event=event, created_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def assign_task(request, task_id):
    task = get_object_or_404(Task, T_ID=task_id)
    
    # ✅ Ensure only Admins, Coordinators, or the Event Organizer can assign tasks
    if request.user.role != "Admin" and request.user not in task.event.E_Coordinators.all() and request.user != task.event.E_Created_By:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    user_id = request.data.get("user_id")
    user = get_object_or_404(User, id=user_id)
    
    task.assigned_to.add(user)
    task.save()
    
    return Response({"message": "Task assigned successfully!"}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def self_assign_task(request, task_id):
    task = get_object_or_404(Task, T_ID=task_id)

    if request.user.role != "Volunteer":
        return Response({"error": "Only volunteers can self-assign tasks"}, status=status.HTTP_403_FORBIDDEN)

    task.assigned_to.add(request.user)
    task.save()

    return Response({"message": "Task self-assigned successfully!"}, status=status.HTTP_200_OK)

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_task_status(request, task_id):
    task = get_object_or_404(Task, T_ID=task_id)

    # ✅ Only Admins, Coordinators, Assigned Volunteers, or the Event Organizer can update task status
    if request.user.role != "Admin" and request.user not in task.event.E_Coordinators.all() and request.user not in task.assigned_to.all() and request.user != task.event.E_Created_By:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    new_status = request.data.get("status")
    if new_status not in ["Not Started", "In Progress", "Completed"]:
        return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

    task.status = new_status
    task.save()

    return Response({"message": f"Task status updated to {new_status}"}, status=status.HTTP_200_OK)

# Update Task
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_task(request, T_ID):
    try:
        task = Task.objects.get(T_ID=T_ID)
    except Task.DoesNotExist:
        return Response({"error": "Task not found!"}, status=status.HTTP_404_NOT_FOUND)

    serializer = TaskSerializer(task, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Task updated successfully!"}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Delete Task
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_task(request, T_ID):
    try:
        task = Task.objects.get(T_ID=T_ID)
        task.delete()
        return Response({"message": "Task deleted successfully!"}, status=status.HTTP_200_OK)
    except Task.DoesNotExist:
        return Response({"error": "Task not found!"}, status=status.HTTP_404_NOT_FOUND)

### ------------------- ATTENDANCE TRACKING ------------------- ###

# Record Attendance (Scan QR Code)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def record_attendance(request):
    data = request.data
    if 'E_ID' not in data:
        return Response({"error": "Event ID is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        event = Event.objects.get(E_ID=data['E_ID'])
        user = request.user  # Authenticated user who is scanning QR

        # Check if user has already attended
        if Attendance.objects.filter(event=event, volunteer=user).exists():
            return Response({"error": "Attendance already recorded!"}, status=status.HTTP_400_BAD_REQUEST)

        Attendance.objects.create(event=event, volunteer=user)
        return Response({"message": "Attendance recorded successfully!"}, status=status.HTTP_201_CREATED)

    except Event.DoesNotExist:
        return Response({"error": "Event not found!"}, status=status.HTTP_404_NOT_FOUND)

# Get Attendance for an Event
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_attendance(request, E_ID):
    try:
        event = Event.objects.get(E_ID=E_ID)
        attendance_records = Attendance.objects.filter(event=event)
        serializer = AttendanceSerializer(attendance_records, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Event.DoesNotExist:
        return Response({"error": "Event not found!"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_attendance_rate(request):
    try:
        total_registered = Registration.objects.count()  # ✅ Count total event registrations
        total_attended = Attendance.objects.count()  # ✅ Count total marked attendances

        if total_registered == 0:
            attendance_rate = 0  # ✅ Avoid division by zero
        else:
            attendance_rate = round((total_attended / total_registered) * 100, 2)  # ✅ Round to 2 decimal places

        return Response({"attendance_rate": attendance_rate}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




@api_view(['POST'])
def contact_us(request):
    name = request.data.get('name')
    email = request.data.get('email')
    message = request.data.get('message')

    if not name or not email or not message:
        return Response({'error': 'All fields are required'}, status=400)

    send_mail(
        f"New Contact Us Message from {name}",
        message,
        email,
        [os.getenv('EMAIL_HOST_USER')],  # Sends to vcoders04@gmail.com
    )

    return Response({'success': 'Message sent successfully!'})


### ------------------- Certificate Generation ------------------- ###
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_certificate(request, E_ID):
    try:
        logger.info(f"Checking certificate for event: {E_ID}")
        user = request.user
        event = get_object_or_404(Event, E_ID=E_ID)

        # 1️⃣ Check if event has ended with proper timezone-aware comparison
        if not event.has_event_ended():
            current_time = timezone.now()
            end_datetime = timezone.make_aware(
                datetime.combine(
                    event.E_End_Date,
                    event.E_End_Time if event.E_End_Time else time(23, 59, 59)
                )
            )
            
            logger.warning(
                f"Event {E_ID} not completed. Current: {current_time}, End: {end_datetime}"
            )
            return Response(
                {
                    "error": "Certificates are only available after the event ends.",
                    "event_end_time": end_datetime.isoformat(),
                    "current_time": current_time.isoformat()
                },
                status=403
            )

        # 2️⃣ Check if user is registered
        if not Registration.objects.filter(event=event, volunteer=user).exists():
            logger.warning(f"User {user.id} is not registered for event {E_ID}.")
            return Response(
                {"error": "You must be registered for this event."},
                status=403
            )

        # 3️⃣ Check attendance (only if event requires it)
        if getattr(event, 'attendance_required', False):
            if not Attendance.objects.filter(event=event, volunteer=user, attended=True).exists():
                logger.warning(f"User {user.id} did not attend event {E_ID}.")
                return Response(
                    {"error": "You did not attend this event."},
                    status=403
                )

        # 4️⃣ Check if certificate exists
        certificate = EventCertificate.objects.filter(event=event, user=user).first()
        if not certificate:
            logger.info(f"No certificate found for user {user.id}, eligible to generate")
            return Response(
                {
                    "can_generate": True,
                    "message": "You are eligible to generate a certificate"
                },
                status=200
            )

        # 5️⃣ Verify the file exists
        if not certificate.file:
            logger.error(f"Certificate file missing in DB for user {user.id}.")
            return Response(
                {"error": "Certificate file is missing from storage."},
                status=404
            )

        try:
            if not default_storage.exists(certificate.file.name):
                logger.error(f"Certificate file not found in storage: {certificate.file.name}")
                return Response(
                    {"error": "Certificate file not found in storage."},
                    status=404
                )
        except Exception as storage_error:
            logger.error(f"Storage check error: {str(storage_error)}")
            return Response(
                {"error": "Error verifying certificate file."},
                status=500
            )

        # 6️⃣ Return the URL
        certificate_url = request.build_absolute_uri(certificate.file.url)
        logger.info(f"Certificate accessible at: {certificate_url}")
        return Response(
            {
                "certificate_url": certificate_url,
                "exists": True,
                
            },
            status=200
        )

    except Exception as e:
        logger.error(f"CRITICAL ERROR in check_certificate: {str(e)}", exc_info=True)
        return Response(
            {
                "error": "Internal server error while checking certificate.",
                "details": str(e)
            },
            status=500
        )
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def download_certificate(request, E_ID):
    try:
        user = request.user
        event = get_object_or_404(Event, E_ID=E_ID)
        
        certificate = EventCertificate.objects.filter(event=event, user=user).first()
        if not certificate:
            return Response({"error": "Certificate not found"}, status=404)

        if not certificate.file:
            return Response({"error": "Certificate file missing"}, status=404)

        # Generate proper URL
        certificate_url = request.build_absolute_uri(certificate.file.url)
        return Response({
            "certificate_url": certificate_url,
            "filename": os.path.basename(certificate.file.name)
        }, status=200)

    except Exception as e:
        print(f"Download error: {str(e)}")
        return Response({"error": "Internal server error"}, status=500)




@api_view(["POST"])
@permission_classes([IsAuthenticated])
def generate_certificate(request, E_ID):
    try:
        user = request.user
        print(f"🧑 User attempting generation: {user.email}")
        
        event = get_object_or_404(Event, E_ID=E_ID)
        print(f"🎪 Event: {event.E_Name} (Status: {event.E_Status})")
        
        # Debug registration status
        reg_exists = Registration.objects.filter(event=event, volunteer=user).exists()
        print(f"📝 Registration exists: {reg_exists}")
        
        if event.E_Status != "Completed":
            return Response({
                "error": "Certificates are only available after the event ends.",
                "debug": {
                    "event_status": event.E_Status,
                    "required_status": "Completed"
                }
            }, status=403)

        # Check if the user is registered for the event
        if not Registration.objects.filter(event=event, volunteer=user).exists():
            return Response({"error": "You must be registered for this event."}, status=403)

        # Ensure the certificate directory exists
        certificate_dir = os.path.join(settings.MEDIA_ROOT, "certificates")
        os.makedirs(certificate_dir, exist_ok=True)

        # Define the certificate filename and paths
        certificate_filename = f"{event.E_ID}_{user.id}.pdf"
        certificate_path = os.path.join(certificate_dir, certificate_filename)

        # Load the PDF template
        pdf_template_path = os.path.join(settings.MEDIA_ROOT, "certificates", "Template1.pdf")

        # Generate the certificate with dynamic name, event, and issued date
        generate_certificate_from_pdf(
            template_pdf=pdf_template_path,
            output_pdf=certificate_path,
            volunteer_name=user.name,
            event_name=event.E_Name,
            issued_date=event.E_End_Date.strftime("%d/%m/%Y")  # Use the event end date as the issued date
        )

        # Save the certificate record in the database
        certificate_record, created = EventCertificate.objects.get_or_create(
            event=event,
            user=user,
            defaults={"file": f"certificates/{certificate_filename}"}
        )

        # Build the absolute URL for the certificate
        print(f"MEDIA_URL: {settings.MEDIA_URL}")  # Debug: Check MEDIA_URL
        print(f"Certificate filename: {certificate_filename}")  # Debug: Check filename
        certificate_url = request.build_absolute_uri(f"{settings.MEDIA_URL}certificates/{certificate_filename}")

        # Return the certificate URL in the response
        return Response({"certificate_url": certificate_url}, status=201)

    except Exception as e:
        # Log the error and return a 500 response
        print(f"❌ Error in generate_certificate: {e}")
        return Response({"error": "Internal Server Error"}, status=500)



def generate_certificate_from_pdf(template_pdf: str, output_pdf: str, volunteer_name: str, event_name: str, issued_date: str):
    """Generates a certificate with the volunteer's name, event name, and issued date."""
    try:
        try:
            pdfmetrics.registerFont(TTFont("DejaVuSans-Bold", FONT_PATH_BOLD))
            pdfmetrics.registerFont(TTFont("DejaVuSans", FONT_PATH_REGULAR))
        except Exception as font_error:
            print(f"⚠️ Font registration error: {font_error}")
            # Fallback to standard fonts if custom fonts fail
            pdfmetrics.registerFont(TTFont("Helvetica-Bold", "Helvetica-Bold"))
            pdfmetrics.registerFont(TTFont("Helvetica", "Helvetica"))
        # Debug: Check input arguments
        print(f"Template PDF: {template_pdf}")
        print(f"Output PDF: {output_pdf}")
        print(f"Volunteer Name: {volunteer_name}")
        print(f"Event Name: {event_name}")
        print(f"Issued Date: {issued_date}")

        # Read the PDF template
        pdf_reader = PdfReader(template_pdf)
        pdf_writer = PdfWriter()

        # Get the first page of the template
        page = pdf_reader.pages[0]

        # Create a buffer for the text overlay
        packet = BytesIO()
        can = canvas.Canvas(packet, pagesize=letter)

        # Register a custom font (ensure the font file exists)
        # font_path = os.path.join(settings.MEDIA_ROOT, "font", "PinyonScript-Regular.ttf")
        # if not os.path.exists(font_path):
        #     font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

        # pdfmetrics.registerFont(TTFont("CustomFont", font_path))

        # Set font and text positions for the volunteer's name (centered)
        can.setFont("DejaVuSans-Bold", 60)
        text_width = can.stringWidth(volunteer_name, "DejaVuSans-Bold", 60)
        can.drawString(280, 320, volunteer_name)


        # Add the new appreciation message
        appreciation_text = (
            f"In gratitude for their valuable contributions and dedication as a volunteer at {event_name} on {issued_date}. "
            "We hope to see them again at future events and appreciate their continued support."
        )
        can.setFont("DejaVuSans", 16)
        can.setFillColorRGB(0, 0, 0)  # Black color

        # Wrap the appreciation text
        appreciation_x = 130  # Start from the left margin (adjust as needed)
        appreciation_y = 275  # Adjust this value to position the text vertically
        max_appreciation_width = 450  # Maximum width for the appreciation text
        appreciation_line_height = 18  # Spacing between lines

        # Use textwrap to split the text into lines
        wrapper = textwrap.TextWrapper(width=70)  # Adjust width as needed
        wrapper.break_long_words = False  # Prevent breaking long words
        wrapper.break_on_hyphens = False  # Prevent breaking on hyphens
        wrapped_lines = wrapper.wrap(appreciation_text)

        # Draw each line
        for i, line in enumerate(wrapped_lines):
            # Check if the line contains the event name
            if event_name in line:
                # Split the line into parts before and after the event name
                parts = line.split(event_name)
                # Draw the part before the event name
                can.setFont("DejaVuSans", 16)
                can.drawString(appreciation_x, appreciation_y - (i * appreciation_line_height), parts[0])
                # Calculate the x-coordinate for the event name
                event_name_x = appreciation_x + can.stringWidth(parts[0], "Helvetica", 16)
                # Draw the event name in bold
                can.setFont("DejaVuSans-Bold", 16)
                can.drawString(event_name_x, appreciation_y - (i * appreciation_line_height), event_name)
                # Calculate the x-coordinate for the part after the event name
                remaining_text_x = event_name_x + can.stringWidth(event_name, "Helvetica-Bold", 16)
                # Draw the part after the event name
                can.setFont("DejaVuSans", 16)
                can.drawString(remaining_text_x, appreciation_y - (i * appreciation_line_height), parts[1])
            else:
                # Draw the line as normal
                can.setFont("DejaVuSans", 16)
                can.drawString(appreciation_x, appreciation_y - (i * appreciation_line_height), line)

        # Set font and text positions for the issued date
        can.setFont("DejaVuSans", 18)
        can.setFillColorRGB(0, 0, 0)  # Black color
        can.drawString(85, 90, f"Issued Date: {issued_date}")  # Below the event name

        # Save the text overlay
        can.save()
        packet.seek(0)

        # Merge the overlay with the template
        overlay_reader = PdfReader(packet)
        overlay_page = overlay_reader.pages[0]
        page.merge_page(overlay_page)
        pdf_writer.add_page(page)

        # Write the final PDF
        with open(output_pdf, "wb") as output_file:
            pdf_writer.write(output_file)

        print(f"✅ Certificate generated: {output_pdf}")

    except Exception as e:
        # Log the error and re-raise
        print(f"❌ Error in generate_certificate_from_pdf: {e}")
        raise
    
    
def convert_image_to_pdf(image_path: str, pdf_path: str):  # noqa: F811
    """Converts an image to a PDF file."""
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfgen import canvas

    # Create a PDF file
    c = canvas.Canvas(pdf_path, pagesize=letter)
    c.drawImage(image_path, 0, 0, width=letter[0], height=letter[1])
    c.save()
    print(f"✅ Converted image to PDF: {pdf_path}")




@api_view(["POST"])
@permission_classes([IsAuthenticated])
def post_announcement(request, event_id):
    event = get_object_or_404(Event, E_ID=event_id)

    if request.user.role != "Admin":
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    serializer = EventAnnouncementSerializer(data=request.data)
    if serializer.is_valid():
        announcement = serializer.save(event=event, posted_by=request.user)

        # ✅ Create notifications for all registered volunteers
        volunteers = event.E_Volunteers.all()
        notifications = [
            Notification(event=event, recipient=volunteer, message=announcement.message)
            for volunteer in volunteers
        ]
        Notification.objects.bulk_create(notifications)

        return Response({"message": "Announcement posted & notifications sent!"}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    """Fetch unread notifications for the logged-in volunteer."""
    notifications = Notification.objects.filter(recipient=request.user, is_read=False).order_by("-created_at")

    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def mark_notifications_as_read(request):
    """Mark all notifications as read for the logged-in user."""
    Notification.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
    return Response({"message": "Notifications marked as read!"}, status=status.HTTP_200_OK)