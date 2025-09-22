from rest_framework import serializers
from .models import User, Category, Expense
from datetime import date

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'


    def validate_expenditure_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be positive")
        return value


    def validate_expenditure_date(self, value):
        if value > date.today():
            raise serializers.ValidationError("Expenditure date cannot be in the future")
        return value