import unittest
from meal_details import MealDetails

class TestMealDetails(unittest.TestCase):
    def setUp(self):
        self.meal = MealDetails()
    
    def test_valid_meal_time(self):
        self.assertTrue(self.meal.set_meal_time("6:30 PM"))
    
    def test_invalid_meal_time(self):
        self.assertFalse(self.meal.set_meal_time(1800))
    
    def test_valid_number_of_people(self):
        self.assertTrue(self.meal.set_number_of_people(5))
    
    def test_invalid_number_of_people(self):
        self.assertFalse(self.meal.set_number_of_people(0))
        self.assertFalse(self.meal.set_number_of_people(150))
    
    def test_valid_prep_time(self):
        self.assertTrue(self.meal.set_prep_time(90))
    
    def test_invalid_prep_time(self):
        self.assertFalse(self.meal.set_prep_time(-10))
        self.assertFalse(self.meal.set_prep_time(300))
    
    def test_valid_calculate_portions(self):
        self.meal.set_number_of_people(10)
        self.assertEqual(self.meal.calculate_portions(), 20)
    
    def test_overflow_calculate_portions(self):
        self.meal.set_number_of_people(100)
        self.assertEqual(self.meal.calculate_portions(), MealDetails.MAX_PORTIONS)
    
    def test_underflow_calculate_portions(self):
        self.meal.set_number_of_people(1)
        self.assertEqual(self.meal.calculate_portions(), 2)
    
    def test_people_data_tracking(self):
        self.meal.update_people_data("user1", 3)
        self.meal.update_people_data("user2", 4)
        self.assertEqual(self.meal.people_data["user1"], 3)
        self.assertEqual(self.meal.people_data["user2"], 4)

if __name__ == '__main__':
    unittest.main()