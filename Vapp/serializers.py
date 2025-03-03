from rest_framework import serializers
from .models import Volunteer,Event
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

class VolunteerSerializer(serializers.ModelSerializer):
    V_Image_Urls = serializers.URLField(required=False, allow_blank=True)
    class Meta:
        model = Volunteer
        fields = '__all__'
        read_only_fields = ['V_ID'] 
        

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'
        #read_only_fields = ['E_ID']
        
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            role=validated_data['role']
        )
        user.set_password(validated_data['password'])  # ✅ Hash password before saving
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        from django.contrib.auth import authenticate
        user = authenticate(username=data['username'], password=data['password'])
        if user:
            token = RefreshToken.for_user(user)
            return {
                'user': UserSerializer(user).data,  # ✅ Return user data
                'refresh': str(token),
                'access': str(token.access_token),
            }
        raise serializers.ValidationError("Invalid credentials")

