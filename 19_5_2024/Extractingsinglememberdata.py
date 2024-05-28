columns = [
_("committee_name:Link/Committee")+"::200",
_("product_name") + "::150",
_("salutation_type") + "::150",
_("custom_customer_status") + "::150",
_("custom_company_type_") + "::150",
_("custom_customer_activity_type") + "::150",
_("tax_id") + "::120",
_("registration_number_in_commercial_register") + "::200",
_("customer_primary_contact") + "::150",
_("Email:Email") + "::150",
_("name_of_the_cioowner_of_the_company") + "::200",
_("name_of_the_cioowner_of_the_company_in_english") + "::200",
_("Member:Link/Customer") + "::150",
_("Company Name In Arabic") + "::170",
_("Company Name In English") + "::170",
_("custom_company_code")+"::150",
_("Company URL") + "::150",
_("Responsible person's name") + "::190",
_("Responsible person's name in English") + "::190",
_("Date of Registration") + "::150",
_("Validity of Registration") + "::150",
_("Registration Number in Exporter Register") + "::200",
_("Date of Registration 2") + "::150",
_("Validity of Registration 2") + "::150",
_("Registration Number in Investment Letter") + "::220",
_("Date of Registration 3") + "::150",
_("Validity of Registration 3") + "::150",
_("Date of Registration 4") + "::150",
_("Validity of Registration 4") + "::150",
_("Customer Status") + "::150",
_("Reason for Suspending") + "::150"
]

# Get values from filters or set them to None
tax_id = filters.get("tax_id")
custom_company_code = filters.get("custom_company_code")
committee_name = filters.get("committee_name")
product_name = filters.get("product_name")
salutation_type = filters.get("salutation_type")
custom_customer_status = filters.get("custom_customer_status")
custom_company_type_ = filters.get("custom_company_type_")
custom_customer_activity_type = filters.get("custom_customer_activity_type")
registration_number_in_commercial_register = filters.get("registration_number_in_commercial_register")
customer_primary_contact = filters.get("customer_primary_contact")
email = filters.get("email")
name_of_the_cioowner_of_the_company = filters.get("name_of_the_cioowner_of_the_company")
name_of_the_cioowner_of_the_company_in_english = filters.get("name_of_the_cioowner_of_the_company_in_english")
#def show_report(filters=None):
mysql = """
    SELECT
        `tabCommittees you would like to join`.`committees` AS `committee_name`,
        `tabCrops that are export`.`product` AS `product_name`,
        `tabCommittees you would like to join`.`salutation` AS `salutation_type`,
        `tabCustomer`.`custom_customer_status`,
        `tabCustomer`.`custom_company_type_`,
        `tabCustomer`.`custom_customer_activity_type`,
        `tabCustomer`.`tax_id`,
        `tabCustomer`.`custom_registration_number_in_commercial_register` AS `registration_number_in_commercial_register`,
        `tabCustomer`.`customer_primary_contact` AS `customer_primary_contact`,
        `tabCustomer`.`custom_email` AS `email`,
        `tabCustomer`.`custom_name_of_the_cioowner_of_the_company` AS `name_of_the_cioowner_of_the_company`,
        `tabCustomer`.`custom_name_of_the_cioowner_of_the_company_in_english` AS `name_of_the_cioowner_of_the_company_in_english`,
        `tabCustomer`.`custom_company_code` AS `custom_company_code`,
        `tabCustomer`.`name` AS `member`,
        `tabCustomer`.`customer_name` AS `company_name_in_arabic`,
        `tabCustomer`.`custom_customer_name_in_english` AS `company_name_in_english`,
        `tabCustomer`.`custom_company_url` AS `company_url`,
        `tabCustomer`.`custom_responsible_persons_name` AS `responsible_person's_name`,
        `tabCustomer`.`custom_responsible_persons_name_in_english` AS `responsible_person's_name_in_english`,
        `tabCustomer`.`custom_date_of_registration` AS `date_of_registration`,
        `tabCustomer`.`custom_even_valid` AS `even_valid`,
        `tabCustomer`.`custom_registration_number_in_exporter_register` AS `registration_number_in_exporter_register`,
        `tabCustomer`.`custom_date_of_registration2` AS `date_of_registration2`,
        `tabCustomer`.`custom_even_valid2` AS `even_valid2`,
        `tabCustomer`.`custom_registration_number_in_investment_letter` AS `registration_number_in_investment_letter`,
        `tabCustomer`.`custom_date_registration3` AS `date_registration3`,
        `tabCustomer`.`custom_even_valid3` AS `even_valid3`,
        `tabCustomer`.`custom_date_registration4` AS `date_registration4`,
        `tabCustomer`.`custom_even_valid4` AS `even_valid4`,
        `tabCustomer`.`custom_customer_status` AS `customer_status`,
        `tabCustomer`.`custom_reason_for_susbending` AS `reason_for_suspending`
        
    FROM
        `tabCustomer`
    LEFT JOIN `tabCommittees you would like to join`
        ON `tabCommittees you would like to join`.`parent` = `tabCustomer`.`name`  
    LEFT JOIN `tabCrops that are export`
        ON `tabCrops that are export`.`parent` = `tabCustomer`.`name`    
    WHERE
        (%(tax_id)s IS NULL OR `tabCustomer`.`tax_id` LIKE %(tax_id)s)
        AND (%(committee_name)s IS NULL OR `tabCommittees you would like to join`.`committees` LIKE %(committee_name)s)
        AND (%(product_name)s IS NULL OR `tabCrops that are export`.`product` LIKE %(product_name)s)
        AND (%(salutation_type)s IS NULL OR `tabCommittees you would like to join`.`salutation` LIKE %(salutation_type)s)
        AND (%(custom_customer_status)s IS NULL OR `tabCustomer`.`custom_customer_status` LIKE %(custom_customer_status)s)
        AND (%(custom_company_type_)s IS NULL OR `tabCustomer`.`custom_company_type_` LIKE %(custom_company_type_)s)
        AND (%(custom_customer_activity_type)s IS NULL OR `tabCustomer`.`custom_customer_activity_type` LIKE %(custom_customer_activity_type)s)
        AND (%(registration_number_in_commercial_register)s IS NULL OR `tabCustomer`.`custom_registration_number_in_commercial_register` LIKE %(registration_number_in_commercial_register)s)
        AND  (%(customer_primary_contact)s IS NULL OR `tabCustomer`.`customer_primary_contact` LIKE %(customer_primary_contact)s) 
        AND (%(email)s IS NULL OR `tabCustomer`.`custom_email` LIKE %(email)s)
        AND (%(name_of_the_cioowner_of_the_company)s IS NULL OR `tabCustomer`.`custom_name_of_the_cioowner_of_the_company` LIKE %(name_of_the_cioowner_of_the_company)s)
        AND (%(name_of_the_cioowner_of_the_company_in_english)s IS NULL OR  `tabCustomer`.`custom_name_of_the_cioowner_of_the_company_in_english` LIKE %(name_of_the_cioowner_of_the_company_in_english)s)
        AND (%(custom_company_code)s IS NULL OR `tabCustomer`.`custom_company_code` LIKE %(custom_company_code)s)
"""

   
mydata = frappe.db.sql(
    mysql,
    {
        "tax_id": f"%{tax_id}%" if tax_id else None,
        "custom_company_code": f"%{custom_company_code}%" if custom_company_code else None,    
        "committee_name": f"%{committee_name}%" if committee_name else None,   
        "product_name": f"%{product_name}%" if product_name else None,
        "salutation_type": f"%{salutation_type}%" if salutation_type else None,
        "custom_customer_status": f"%{custom_customer_status}%" if custom_customer_status else None,
        "custom_company_type_": f"%{custom_company_type_}%" if custom_company_type_ else None,
        "custom_customer_activity_type": f"%{custom_customer_activity_type}%" if custom_customer_activity_type else None,
        "registration_number_in_commercial_register": f"%{registration_number_in_commercial_register}%" if registration_number_in_commercial_register else None,
        "customer_primary_contact": f"%{customer_primary_contact}%" if customer_primary_contact else None,
        "email": f"%{email}%" if email else None,
        "name_of_the_cioowner_of_the_company": f"%{name_of_the_cioowner_of_the_company}%" if name_of_the_cioowner_of_the_company else None,
        "name_of_the_cioowner_of_the_company_in_english": f"%{name_of_the_cioowner_of_the_company_in_english}%" if name_of_the_cioowner_of_the_company_in_english else None,
          
    },
    as_dict=True,
)
data = columns ,mydata



