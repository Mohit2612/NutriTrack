@echo off
node test_dashboard.js > test_out.txt 2>&1
node test_food_search.js >> test_out.txt 2>&1
node test_food_suggestions.js >> test_out.txt 2>&1
node test_meals.js >> test_out.txt 2>&1
node test_progress.js >> test_out.txt 2>&1
node test_water_weight.js >> test_out.txt 2>&1
node test_admin.js >> test_out.txt 2>&1
node test_admin_crud.js >> test_out.txt 2>&1
node test_admin_reports.js >> test_out.txt 2>&1
node test_flow.js >> test_out.txt 2>&1
echo Done >> test_out.txt
