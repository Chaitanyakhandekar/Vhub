from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Event, Task, Attendance, Registration,EventAnnouncement,SampleTask,Notification,EventPhoto, Badge, UserBadge



# ✅ User Serializer
class UserSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField()
    class Meta:
        model = User
        fields = [
            'id', 'email', 'name', 'phone', 'role',
            'gender',
            'college_name', 'faculty', 'year_of_study', 
            'profile_image', 'is_active', 'created_at'
        ]
    def get_profile_image(self, obj):
        request = self.context.get("request")
        if obj.profile_image:
            return request.build_absolute_uri(obj.profile_image.url) if request else obj.profile_image.url
        return None


# ✅ Signup Serializer
class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['email', 'name', 'phone', 'role', 'college_name', 'faculty', 'year_of_study', 'password']

    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            phone=validated_data.get('phone', ''),  # ✅ Default to empty string if not provided
            role=validated_data.get('role', 'Volunteer'),  # ✅ Default role as "Volunteer"
            gender=validated_data.get('gender', ''),
            college_name=validated_data.get('college_name', ''),  # ✅ Default to empty
            faculty=validated_data.get('faculty', ''),
            year_of_study=validated_data.get('year_of_study', None),  # ✅ Allow null
            password=validated_data['password']
        )

# ✅ Login Serializer
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError('Invalid email or password.')
        if not user.is_active:
            raise serializers.ValidationError('User account is inactive.')
        return {'user': user}

# ✅ Registration Serializer (Handles event sign-ups & QR codes)



class EventAnnouncementSerializer(serializers.ModelSerializer):
    posted_by = UserSerializer(read_only=True)

    class Meta:
        model = EventAnnouncement
        fields = "__all__"

class SampleTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = SampleTask
        fields = "__all__"


class EventSerializer(serializers.ModelSerializer):
    E_Created_By = UserSerializer(read_only=True)  # Show event creator details
    E_Volunteers = UserSerializer(many=True, read_only=True)  # Show registered volunteers
    E_Registered_Count = serializers.IntegerField(read_only=True)  # Track number of registered volunteers
    E_Photo = serializers.ImageField()  # ✅ Use SerializerMethodField
    announcements = EventAnnouncementSerializer(many=True, read_only=True)
    sample_tasks = SampleTaskSerializer(many=True, read_only=True)
    
    E_Start_Time = serializers.TimeField(format='%H:%M', required=False)
    E_End_Time = serializers.TimeField(format='%H:%M', required=False)


    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['E_ID']
        
        
    def get_E_Photo(self, obj):
        request = self.context.get('request')  # ✅ Get request context
        if obj.E_Photo:
            if request:  # ✅ Prevent AttributeError
                return request.build_absolute_uri(obj.E_Photo.url)  # ✅ Full URL
            return obj.E_Photo.url  # ✅ Return relative URL if no request
        return None  # ✅ Handle case where no photo is uploaded
    def validate(self, data):
        # Add validation for time consistency
        if 'E_Start_Date' in data and 'E_End_Date' in data:
            if data['E_Start_Date'] > data['E_End_Date']:
                raise serializers.ValidationError("End date must be after start date")
            
            if data['E_Start_Date'] == data['E_End_Date']:
                if 'E_Start_Time' in data and 'E_End_Time' in data:
                    if data['E_Start_Time'] >= data['E_End_Time']:
                        raise serializers.ValidationError("End time must be after start time for same-day events")
        
        return data


class EventPhotoSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    
    class Meta:
        model = EventPhoto
        fields = ['id', 'url', 'uploaded_at']
    
    def get_url(self, obj):
        if obj.photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.photo.url)
            return obj.photo.url
        return None

class BadgeSerializer(serializers.ModelSerializer):
    earned = serializers.SerializerMethodField()
    earned_date = serializers.SerializerMethodField()
    
    class Meta:
        model = Badge
        fields = ['id', 'name', 'description', 'icon', 'earned', 'earned_date']
    
    def get_earned(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.userbadge_set.filter(user=request.user).exists()
        return False
    
    def get_earned_date(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            user_badge = obj.userbadge_set.filter(user=request.user).first()
            return user_badge.earned_at if user_badge else None
        return None

class UserBadgeSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer()
    
    class Meta:
        model = UserBadge
        fields = ['badge', 'earned_at', 'metadata']
        

class EventAnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventAnnouncement
        fields = "__all__"
        read_only_fields = ["A_ID", "event", "posted_by", "created_at"]


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"
        read_only_fields = ["N_ID", "recipient", "event", "created_at"]




# ✅ Task Serializer (Shows assigned user & related event)
class TaskSerializer(serializers.ModelSerializer):
    assigned_to = UserSerializer(many=True, read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Task
        fields = "__all__"


# ✅ Attendance Serializer (Handles QR Code Scanning)
class AttendanceSerializer(serializers.ModelSerializer):
    event = EventSerializer(read_only=True)
    volunteer = UserSerializer(read_only=True)

    class Meta:
        model = Attendance
        fields = '__all__'
        read_only_fields = ['A_ID', 'scanned_at']
        

class RegistrationSerializer(serializers.ModelSerializer):
    volunteer = UserSerializer(read_only=True)  # ✅ Return full volunteer details
    event = EventSerializer(read_only=True)  # ✅ Return full event details instead of just ID

    class Meta:
        model = Registration
        fields = ['R_ID', 'event', 'volunteer', 'qr_code']
        read_only_fields = ['R_ID', 'qr_code']