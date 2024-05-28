# Define columns for the report in the desired order
columns = [
    _("Tax ID") + "::100",
    _("Customer Name") + "::170",
    _("name1") + "::150",
    _("custom_company_code") + "::100",
    _("season") + "::100",
    _("season__name") + "::100",
    _("Total Amount in EGP: Currency") + "::150",
    _("customer_group") + "::200",
    _("price: Currency") + "::150",
    _("is_member") + "::100",  # New column for membership check
]

# Get tax_id from filters (if available)
tax_id = filters.get("tax_id")
message = "Your Exports Details in the Last 3 Seasons"

# Check if tax_id is provided; if not, return an empty result
if not tax_id:
    data = columns, [], message 
    
    
else:
    # SQL query to fetch data for the report
    mysql = """
    
    SELECT
     `tabVolume Of Member Exports`.`tax__number` AS `tax_id`,
     `tabCustomer`.`customer_name` AS `customer_name`,
     `tabVolume Of Member Exports`.`name1` AS `name1`,
     `tabCustomer`.`custom_company_code` AS `custom_company_code`,
     `tabVolume Of Member Exports`.`season` AS `season`,
     `tabVolume Of Member Exports`.`season__name` AS `season__name`,
     SUM(`tabVolume Of Member Exports`.`total_amount_in_egp`) AS `total_amount_in_egp`,
     CASE
         WHEN SUM(`tabVolume Of Member Exports`.`total_amount_in_egp`) BETWEEN 0 AND 1000000 THEN 'Less than 1 million EGP'
         WHEN SUM(`tabVolume Of Member Exports`.`total_amount_in_egp`) BETWEEN 1000001 AND 10000000 THEN 'Between 1M and 10M EGP'
         WHEN SUM(`tabVolume Of Member Exports`.`total_amount_in_egp`) BETWEEN 10000001 AND 20000000 THEN 'Between 10M and 20M EGP'
         WHEN SUM(`tabVolume Of Member Exports`.`total_amount_in_egp`) BETWEEN 20000001 AND 100000000 THEN 'Between 20M and 100M EGP'
         ELSE 'More than 100 million EGP'
     END AS `customer_group`,
    
    CASE
        WHEN SUM(`tabVolume Of Member Exports`.`total_amount_in_egp`) BETWEEN 0 AND 1000000 THEN '1000'
        WHEN SUM(`tabVolume Of Member Exports`.`total_amount_in_egp`) BETWEEN 1000001 AND 10000000 THEN '1300'
        WHEN SUM(`tabVolume Of Member Exports`.`total_amount_in_egp`) BETWEEN 10000001 AND 20000000 THEN '2000'
        WHEN SUM(`tabVolume Of Member Exports`.`total_amount_in_egp`) BETWEEN 20000001 AND 100000000 THEN '2500'
        ELSE '3000'
    END AS `price`,
    
    CASE
        WHEN EXISTS (
            SELECT 1 FROM `tabVolume Of Member Exports`
            WHERE `tabVolume Of Member Exports`.`tax__number` = `tabCustomer`.`tax_id`
        ) THEN 'Yes'
        ELSE 'No'
    END AS `is_member`
    
FROM
    `tabVolume Of Member Exports`
LEFT JOIN
    `tabCustomer` ON `tabVolume Of Member Exports`.`tax__number` = `tabCustomer`.`tax_id`
WHERE
    (%(tax_id)s IS NULL OR `tabVolume Of Member Exports`.`tax__number` LIKE %(tax_id)s)
    AND `tabVolume Of Member Exports`.`season` IN (
        SELECT `name` FROM `tabExport Season`
        WHERE YEAR(`start_date`) BETWEEN 2021 AND 2023
        OR YEAR(`end_date`) BETWEEN 2021 AND 2023
    )
GROUP BY
    `tabVolume Of Member Exports`.`tax__number`,
    `tabCustomer`.`customer_name`,
    `tabVolume Of Member Exports`.`name1`,
    `tabCustomer`.`custom_company_code`,
    `tabVolume Of Member Exports`.`season`,
    `tabVolume Of Member Exports`.`season__name`
ORDER BY
    `tabVolume Of Member Exports`.`season` DESC;
"""


    # Execute SQL query to fetch data
    mydata = frappe.db.sql(
        mysql,
        {
            "tax_id": f"%{tax_id}%" if tax_id else None,
        },
        as_dict=True,
    )

    # Sort mydata based on the 'season' column in descending order
    mydata_sorted = sorted(mydata, key=lambda x: x['season'], reverse=True)

    # Function to apply color based on customer_group value
    def apply_color_to_is_member(value):
        if value == 'No':
            return '<span style="color: red;text-align: center; vertical-align: middle;">No</span>'
        elif value == 'Yes':
            return '<span style="color: green;text-align: center; vertical-align: middle;">Yes</span>'
        else:
            return value  # Return the value unchanged if no condition is met

    # Apply color conditionally to the 'is_member' column in mydata
    for row in mydata:
        row['is_member'] = apply_color_to_is_member(row['is_member'])

    # Extract values for report_summary from the first row of mydata_sorted (i.e., greatest season)
    if mydata_sorted:
        season_name_value = mydata_sorted[0]['season__name']
        amount_in_egp_value = mydata_sorted[0]['total_amount_in_egp']
        customer_group_value = mydata_sorted[0]['customer_group']
        price_value = mydata_sorted[0]['price']
    else:
        season_name_value, amount_in_egp_value, customer_group_value, price_value = 'N/A', 'N/A', 'N/A', 'N/A'

    # Creating report_summary based on extracted values
    report_summary = [
        {"value": season_name_value, "label": "Season Name", "datatype": "Data"},
        {"value": str(amount_in_egp_value), "label": "Amount in EGP", "datatype": "Currency"},
        {"value": customer_group_value, "label": "Customer Group", "datatype": "Data"},
        {"value": price_value, "label": "Price", "datatype": "Currency"}
    ]

    # Combine columns and fetched data for the report along with report_summary
    data = columns, mydata, message, None, report_summary
