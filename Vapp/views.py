from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Volunteer,Event,CustomUser
from rest_framework import status
from .serializers import VolunteerSerializer,EventSerializer,UserSerializer, RegisterSerializer, LoginSerializer
import uuid
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics, permissions
from rest_framework.views import APIView
from django.contrib.auth import login, logout

from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User

@api_view(['GET', 'POST'])
def create_volunteer(request):
    if request.method == 'GET':
        try:
            volunteers = Volunteer.objects.all()
            serializer = VolunteerSerializer(volunteers, many=True)
            return Response(serializer.data)
        except Exception as e:
            print("Error fetching volunteers:", e)  # Debugging
            return Response({"error": str(e)}, status=500)  # Send error response

    if request.method == 'POST':
        serializer = VolunteerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Volunteer added successfully!"}, status=201)
        return Response(serializer.errors, status=400)



@api_view(['DELETE'])
def delete_volunteer_by_phone(request, phone_no):
    try:
        volunteer = Volunteer.objects.get(V_Phone_No=phone_no)
        volunteer.delete()
        return Response({"message": "Volunteer deleted successfully!"}, status=200)
    except Volunteer.DoesNotExist:
        return Response({"error": "Volunteer not found!"}, status=404)

@api_view(['PUT'])  # ✅ Must use PUT (not POST)
def update_volunteer(request, phone_no):
    try:
        volunteer = Volunteer.objects.get(V_Phone_No=phone_no)
    except Volunteer.DoesNotExist:
        return Response({"error": "Volunteer not found!"}, status=status.HTTP_404_NOT_FOUND)

    serializer = VolunteerSerializer(volunteer, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Volunteer updated successfully!"}, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def get_volunteer_by_phone(request, phone_no):
    try:
        volunteer = Volunteer.objects.get(V_Phone_No=phone_no)
        serializer = VolunteerSerializer(volunteer)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Volunteer.DoesNotExist:
        return Response({"error": "Volunteer Not Found!"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
def create_event(request):
    serializer = EventSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Event created successfully!"}, status=201)
    print("Serializer Errors:", serializer.errors)  # Debugging Line
    return Response(serializer.errors, status=400)




@api_view(['DELETE'])
def delete_event(request, event_id):
    try:
        event = Event.objects.get(E_ID=event_id)
        event.delete()
        return Response({"message": "Event deleted successfully!"}, status=200)
    except Event.DoesNotExist:
        return Response({"error": "Event not found!"}, status=404)


@api_view(['PUT'])
def update_event(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
    except Event.DoesNotExist:
        return Response({"error": "Event not found!"}, status=status.HTTP_404_NOT_FOUND)

    serializer = EventSerializer(event, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Event updated successfully!"}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_event_by_id(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
        serializer = EventSerializer(event)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Event.DoesNotExist:
        return Response({"error": "Event Not Found!"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def get_all_events(request):
    try:
        events = Event.objects.all()  # Get all event records
        serializer = EventSerializer(events, many=True)  # Serialize data
        return Response(serializer.data, status=status.HTTP_200_OK)  # Return JSON response
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data)
        return Response(serializer.errors, status=400)

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"message": "Logged out"}, status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role  # Directly fetching role from CustomUser model
    })