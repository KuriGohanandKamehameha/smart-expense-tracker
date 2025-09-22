from django.db import models

# Create your models here.

class User(models.Model):
    full_name = models.CharField(max_length=100)

    def __str__(self):
        return self.full_name

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True, default='Miscellaneous')

    def __str__(self):
        return self.name

class Expense(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    expenditure_amount = models.DecimalField(max_digits=10, decimal_places=2)
    expenditure_date = models.DateField()

    def __str__(self):
        return f"{self.user.full_name} - {self.category.name} - {self.expenditure_amount}"
