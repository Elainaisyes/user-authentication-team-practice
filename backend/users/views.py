from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login

@api_view(['GET'])
def test_api(request):
    if request.user.is_authenticated:
        return Response({'message': 'Logged in'})
    return Response({'error': 'Not logged in'},status=401)

@api_view(['POST'])
def register_user(req):
    username = req.data.get('username')
    password = req.data.get('password')

    if not username or not password:
        return Response({"error": "Missing fields"}, status=400)

    if " " in username or " " in password:
            return Response({'error:' 'Username & Password cannot contain spaces'}, status=400)

    if len(password) < 8:
        return Response({'error': 'Password must be longer than 8 characters.'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "User exists"}, status=400)

    user = User.objects.create_user(
        username=username,
        password=password
    )

    return Response({"message": "User created"})

@api_view(["POST"])
def login_user(req):
    username = req.data.get('username')
    password = req.data.get('password')

    if not username or not password:
        return Response({'error': 'Missing fields'}, status=400)

    user = authenticate(username=username, password=password)

    if user is None:
        return Response({'error': 'Invalid credentials'}, status=401)

    login(req, user)

    return Response({'message': 'Login successful'})


