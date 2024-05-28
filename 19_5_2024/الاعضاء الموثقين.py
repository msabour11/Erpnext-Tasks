columns = [
    _("custom_company_code") + "::120",
    _("name:Link/Customer") + "::150",
    _("Customer name") + "::120",
    _("Custom customer_name_in_english") + "::120",
    _("custom_name_of_the_cioowner_of_the_company") + "::150",
    _("custom_responsible_persons_name") + "::150",
    _("tax_id") + "::120",
    _("customer_group") + "::120",
]

# Get values from filters or set them to None
customer_name = filters.get("name")
customer_group = filters.get("customer_group")
tax_id = filters.get("tax_id")
custom_company_code = filters.get("custom_company_code")

mysql = """
    SELECT
        `tabCustomer`.`custom_company_code`,
        `tabCustomer`.`name`,
        `tabCustomer`.`customer_name` AS `customer_name`,
        `tabCustomer`.`custom_customer_name_in_english`,
        `tabCustomer`.`custom_name_of_the_cioowner_of_the_company`,
        `tabCustomer`.`custom_responsible_persons_name`,
        `tabCustomer`.`tax_id`,
        `tabCustomer`.`customer_group`
    FROM
        `tabCustomer`
    WHERE
        `tabCustomer`.`custom_customer_status` = "Suspended"
        AND (%(customer_name)s IS NULL OR `tabCustomer`.`name` LIKE %(customer_name)s)
        AND (%(tax_id)s IS NULL OR `tabCustomer`.`tax_id` LIKE %(tax_id)s)
        AND (%(custom_company_code)s IS NULL OR `tabCustomer`.`custom_company_code` LIKE %(custom_company_code)s)
        AND (
            `tabCustomer`.`name` NOT IN (
                SELECT DISTINCT
                    `tabSales Invoice`.`customer`
                FROM
                    `tabSales Invoice`
                WHERE
                    `tabSales Invoice`.`docstatus` = 1
                    AND (
                        `tabSales Invoice`.`status` <> "Paid"
                        OR `tabSales Invoice`.`custom_annual_fees` <> 1
                    )
            )
            OR `tabCustomer`.`name` NOT IN (
                SELECT DISTINCT
                    `tabSales Invoice`.`customer`
                FROM
                    `tabSales Invoice`
            )
        )
        AND (%(customer_group)s IS NULL OR `tabCustomer`.`customer_group` = %(customer_group)s)
"""

mydata = frappe.db.sql(
    mysql,
    {
        "customer_name": f"%{customer_name}%" if customer_name else None,
        "tax_id": f"%{tax_id}%" if tax_id else None,
        "custom_company_code": f"%{custom_company_code}%" if custom_company_code else None,
        "customer_group": customer_group if customer_group else None,
    },
    as_dict=True,
)

data = columns, mydata



# js

frappe.query_reports['الاعضاء  الموقوفين'] = {
    "filters": [
        {
            fieldname: "name",
            label: "Please select customer",
            fieldtype: "Link",
            options: "Customer",
            width: "200px",  // Set the desired width for the label
        },
        {
            fieldname: "customer_group",
            label: "Please select customer Group",
            fieldtype: "Link",
            options: "Customer Group",
            width: "200px",  // Set the desired width for the label
        },
        {
            fieldname: "custom_company_code",
            label: "Please write customer code",
            fieldtype: "Data",
            width: "200px",  // Set the desired width for the label
        },
        {
            fieldname: "tax_id",
            label: "Please write Tax ID",
            fieldtype: "Data",
            width: "200px",  // Set the desired width for the label
        },
        {
            fieldname: "customer_name",
            label: "Please write Company name",
            fieldtype: "Data",
            width: "200px",  // Set the desired width for the label
        },
{
    "fieldname": "customer",
    "label": __("Customer"),
    "fieldtype": "MultiSelectList",
    "reqd": 1,
    get_data: function(txt) {
        if (!frappe.query_report.filters) return;

        let customer_type = "Customer"; // Assuming "Customer" is the party type for customers
        return frappe.db.get_link_options(customer_type, txt);
    }
}
    ]
};
