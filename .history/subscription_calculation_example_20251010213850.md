# Subscription Calculation Examples

## Your Scenario: ₹699.74 Course Fees

**Input:**
- Course Fees: ₹699.74
- Max Students: 30
- Current Students: 0

**Calculation:**
1. **7% of ₹699.74 = ₹48.98**
2. **Minimum per student = ₹35**
3. **Commission per student = max(₹48.98, ₹35) = ₹48.98**
4. **Effective students = max(30, 20) = 30**
5. **Total subscription = ₹48.98 × 30 = ₹1,469.40**

## Other Examples

### Example 1: ₹499 Course Fees
- 7% of ₹499 = ₹34.93
- Minimum = ₹35
- Commission per student = max(₹34.93, ₹35) = ₹35
- Total subscription = ₹35 × 30 = ₹1,050

### Example 2: ₹500 Course Fees
- 7% of ₹500 = ₹35
- Minimum = ₹35
- Commission per student = max(₹35, ₹35) = ₹35
- Total subscription = ₹35 × 30 = ₹1,050

### Example 3: ₹1,000 Course Fees
- 7% of ₹1,000 = ₹70
- Minimum = ₹35
- Commission per student = max(₹70, ₹35) = ₹70
- Total subscription = ₹70 × 30 = ₹2,100

## The Logic

The subscription calculation follows this formula:
```
Commission per student = max(7% of course fees, ₹35)
Total subscription = Commission per student × max(student_limit, 20)
```

This ensures:
- Teachers with low course fees pay minimum ₹35 per student
- Teachers with high course fees pay 7% of their course fees per student
- The subscription is based on the maximum student limit, not current enrollment
- Minimum 20 students are always considered for calculation
