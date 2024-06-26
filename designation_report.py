columns = [
    {"label": _("Code"), "fieldname": "custom_code_", "fieldtype": "Data", "width": 150},
    {"label": _("Designation Name"), "fieldname": "designation_name", "fieldtype": "Data", "width": 150},
    {"label": _("Parent Designation"), "fieldname": "custom_parent_designation", "fieldtype": "Data", "width": 150},
    {"label": _("Department"), "fieldname": "custom_department", "fieldtype": "Data", "width": 150},
    {"label": _("Branch"), "fieldname": "branch", "fieldtype": "Data", "width": 150},
    {"label": _("Current"), "fieldname": "current", "fieldtype": "Int", "width": 150},
    {"label": _("Vacancies"), "fieldname": "vacancies", "fieldtype": "Int", "width": 150},
    {"label": _("HC"), "fieldname": "total", "fieldtyp"precision": 2  # Ensure the number is displayed with full precisione": "Int", "width": 150},
]

designation_name=filters.get('designation_name')
custom_department=filters.get('custom_department')
branch=filters.get('branch')
custom_code_=filters.get('custom_code_')


sql = """ select `tabDesignation`.`custom_code_`, `tabDesignation`.`designation_name`,
`tabDesignation`.`custom_parent_designation`,
`tabDesignation`.`custom_department`, `tabJob Planning`.`total`, `tabJob Planning`.`branch`, `tabJob Planning`.`current`,
`tabJob Planning`.`vacancies` from `tabDesignation` 
join `tabJob Planning`  on `tabDesignation`.`name` = `tabJob Planning`.`parent`
  WHERE (%(designation_name)s IS NULL OR `tabDesignation`.`designation_name` LIKE %(designation_name)s)
  and
    (%(custom_department)s IS NULL OR `tabDesignation`.`custom_department` LIKE %(custom_department)s)
    and
     (%(branch)s IS NULL OR `tabJob Planning`.`branch` LIKE %(branch)s)
     and
      (%(custom_code_)s IS NULL OR `tabDesignation`.`custom_code_` LIKE %(custom_code_)s)
     
    
  
"""
mydata = frappe.db.sql(sql,{"designation_name":  f"%{designation_name}%" if designation_name else None,
                                "custom_department": f"%{custom_department}%" if custom_department else None,
                                "branch":  f"%{branch}%" if branch else None,
                                "custom_code_":  f"%{custom_code_}%" if custom_code_ else None
                              }, as_dict=True)
# chart                            
chart_data = {
    'labels': [d['designation_name'] for d in mydata],
    'datasets': [
        {
            'name': _('Current'),
            'values': [d['current'] for d in mydata]
        },
        {
            'name': _('Vacancies'),
            'values': [d['vacancies'] for d in mydata]
        }
    ]
}

chart = {
    "data": chart_data,
    "type": 'bar',
    "height": 300,
    "title": _('Designation Overview'),
}
# Calculate summary data
total_current = sum([d['current'] for d in mydata])
total_vacancies = sum([d['vacancies'] for d in mydata])
# Create report summary
report_summary = [
    {
        "value": len(mydata),
        "indicator": "Green",
        "label": _("Total Designations"),
    },
    {
        "value": total_current,
        "indicator": "Blue",
        "label": _("Total Current"),
    },
    {
        "value": total_vacancies,
        "indicator": "Red",
        "label": _("Total Vacancies"),
    },
]
data = columns ,mydata,None,chart,report_summary


# filters

frappe.query_reports['Designation Report'] ={
        "filters":[
              {   fieldname:"designation_name",
                label:"Designation",
                fieldtype:"Link",
                options:"Designation",
                width:"200px"
            
            },
        
            {   fieldname:"custom_department",
                label:"Department",
                fieldtype:"Link",
                options:"Department",
                width:"200px"
            
            },
            {   fieldname:"branch",
                label:"Branch",
                fieldtype:"Link",
                options:"Branch",
                width:"200px"
            
            }
        
        
        ]
    
    
    }
