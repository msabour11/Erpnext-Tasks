# import frappe


# def execute(filters=None):
#     columns = [
#         {"fieldname": "name", "fieldtype": "Data", "label": "Refrence"},
#         {
#             "fieldname": "total",
#             "fieldtype": "Currency",
#             "label": "Total",
#             "options": "EGP",
#         },
#         {"fieldname": "receipt_number", "fieldtype": "Data", "label": "receipt number"},
#         {"fieldname": "serial", "fieldtype": "Data", "label": "Serial"},
#     ]

#     my_data = frappe.get_all(
#         "Teller Invoice",
#         fields=["name", "total", "receipt_number", "shift.serial"],
#         filters={"docstatus": 1},
#     )

#     chart = {
#         "data": {
#             "labels": [x.name for x in my_data],
#             "datasets": [{"values": [x.total for x in my_data]}],
#         },
#         "type": "line",
#     }

#     data= columns, my_data, "Teller Report", chart
columns = [
    {"fieldname": "name", "fieldtype": "Data", "label": "Refrence"},
    {
        "fieldname": "total",
        "fieldtype": "Currency",
        "label": "Total",
        "options": "EGP",
    },
    {"fieldname": "receipt_number", "fieldtype": "Data", "label": "receipt number"},
    {"fieldname": "serial", "fieldtype": "Data", "label": "Serial"},
]

invoice_filters = filters.get("invoice") if filters else None
all_filters = {"docstatus": 1}
if invoice_filters:
    all_filters["name"] = invoice_filters

my_data = frappe.get_all(
    "Teller Invoice",
    fields=["name", "total", "receipt_number", "shift.serial"],
    filters=all_filters,
)

chart = {
    "data": {
        "labels": [x.name for x in my_data],
        "datasets": [{"values": [x.total for x in my_data]}],
    },
    "type": "line",
}

data = columns, my_data, "Teller Report", chart
