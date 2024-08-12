# Define the columns dynamically based on branches
branches = frappe.db.sql("""SELECT DISTINCT branch FROM `tabJob Planning`""", as_dict=True)
columns = [
    {"label": _("Code"), "fieldname": "custom_code_", "fieldtype": "Data", "width": 150},
    {"label": _("Designation Name"), "fieldname": "designation_name", "fieldtype": "Data", "width": 150},
    {"label": _("Parent Designation"), "fieldname": "custom_parent_designation", "fieldtype": "Data", "width": 150},
    {"label": _("Department"), "fieldname": "custom_department", "fieldtype": "Data", "width": 150},
]

# Add branch-specific columns
for branch in branches:
    branch_name = branch['branch']
    columns.extend([
        {"label": _(f"{branch_name} HC"), "fieldname": f"{branch_name}_hc", "fieldtype": "Int", "width": 150},
        {"label": _(f"{branch_name} Current"), "fieldname": f"{branch_name}_current", "fieldtype": "Int", "width": 150},
        {"label": _(f"{branch_name} Vacancies"), "fieldname": f"{branch_name}_vacancies", "fieldtype": "Int", "width": 150},
    ])

# Fetch the data
designation_name = filters.get('designation_name')
custom_department = filters.get('custom_department')
branch = filters.get('branch')
custom_code_ = filters.get('custom_code_')

sql = """
SELECT 
    `tabDesignation`.`custom_code_`, 
    `tabDesignation`.`designation_name`,
    `tabDesignation`.`custom_parent_designation`,
    `tabDesignation`.`custom_department`, 
    `tabJob Planning`.`branch`,
    `tabJob Planning`.`total`, 
    `tabJob Planning`.`current`,
    `tabJob Planning`.`vacancies`
FROM 
    `tabDesignation` 
JOIN 
    `tabJob Planning`  
ON 
    `tabDesignation`.`name` = `tabJob Planning`.`parent`
WHERE 
    (%(designation_name)s IS NULL OR `tabDesignation`.`designation_name` LIKE %(designation_name)s)
    AND (%(custom_department)s IS NULL OR `tabDesignation`.`custom_department` LIKE %(custom_department)s)
    AND (%(branch)s IS NULL OR `tabJob Planning`.`branch` LIKE %(branch)s)
    AND (%(custom_code_)s IS NULL OR `tabDesignation`.`custom_code_` LIKE %(custom_code_)s)
"""

mydata = frappe.db.sql(sql, {
    "designation_name": f"%{designation_name}%" if designation_name else None,
    "custom_department": f"%{custom_department}%" if custom_department else None,
    "branch": f"%{branch}%" if branch else None,
    "custom_code_": f"%{custom_code_}%" if custom_code_ else None
}, as_dict=True)

# Process the data to pivot branches into columns
data_dict = {}
for row in mydata:
    key = (row['custom_code_'], row['designation_name'], row['custom_parent_designation'], row['custom_department'])
    if key not in data_dict:
        data_dict[key] = {
            "custom_code_": row['custom_code_'],
            "designation_name": row['designation_name'],
            "custom_parent_designation": row['custom_parent_designation'],
            "custom_department": row['custom_department'],
        }
    branch_name = row['branch']
    data_dict[key][f"{branch_name}_hc"] = row['total']
    data_dict[key][f"{branch_name}_current"] = row['current']
    data_dict[key][f"{branch_name}_vacancies"] = row['vacancies']

# Aggregate data for chart
chart_data_aggregated = {}
for row in mydata:
    designation = row['designation_name']
    if designation not in chart_data_aggregated:
        chart_data_aggregated[designation] = {'current': 0, 'vacancies': 0}
    chart_data_aggregated[designation]['current'] += row['current']
    chart_data_aggregated[designation]['vacancies'] += row['vacancies']

# Prepare chart data
chart_labels = list(chart_data_aggregated.keys())
current_values = [data['current'] for data in chart_data_aggregated.values()]
vacancies_values = [data['vacancies'] for data in chart_data_aggregated.values()]

chart_data = {
    'labels': chart_labels,
    'datasets': [
        {
            'name': _('Current'),
            'values': current_values
        },
        {
            'name': _('Vacancies'),
            'values': vacancies_values
        }
    ]
}

chart = {
    "data": chart_data,
    "type": 'bar',  # Changed to bar for better visualization of comparative data
    "height": 300,
    "title": _('Designation Overview'),
}

# Return the updated chart along with columns and data
data = columns, list(data_dict.values()), None, chart