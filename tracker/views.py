from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User, Category, Expense
from .serializers import ExpenseSerializer, UserSerializer, CategorySerializer
from django.db.models import Sum
from django.db.models.functions import ExtractMonth, ExtractYear

@api_view(['GET', 'POST'])
def users_list_create(request):
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def categories_list_create(request):
    if request.method == 'GET':
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def expenses_list_create(request):
    if request.method == 'GET':
        user_id = request.query_params.get('user_id')
        expenses = Expense.objects.all()
        if user_id:
            expenses = expenses.filter(user_id=user_id)
        expenses = expenses.order_by('-expenditure_date')  # <- use correct field name
        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ExpenseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def monthly_summary(request):
    user_id = request.query_params.get('user_id')
    year = request.query_params.get('year')
    month = request.query_params.get('month')

    if not user_id or not year or not month:
        return Response({"error": "user_id, year, and month are required"}, status=400)


    expenses = Expense.objects.filter(
        user_id=user_id,
        expenditure_date__year=year,
        expenditure_date__month=month
    )


    total_expenses = expenses.aggregate(total=Sum('expenditure_amount'))['total'] or 0


    expenses_by_category = (
        expenses
        .values('category__name')
        .annotate(total_amount=Sum('expenditure_amount'))
        .order_by('-total_amount')
    )


    response_data = {
        "total_expenses": str(total_expenses),
        "expenses_by_category": [
            {"category_name": e['category__name'], "total_amount": str(e['total_amount'])}
            for e in expenses_by_category
        ]
    }

    return Response(response_data)