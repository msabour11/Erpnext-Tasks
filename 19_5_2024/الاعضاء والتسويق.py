columns = [
     _("customer_name:Link/Customer") + "::120",
    _("committee_name:Link/Committee") + "::150",
    _("product_name") + "::150",
    _("salutation_type") + "::150",
    _("custom_customer_status") + "::150",
    _("custom_company_type_") + "::150",
    _("custom_customer_activity_type") + "::150",
    _("territory") + "::150",
    _("custom_joining_date") + "::150",
    _("custom_company_code") + "::150",
    _("Member:Link/Customer") + "::150",
    _("customer_name_english") + "::300",
    _("custom_name_of_the_cioowner_of_the_company") + "::350",
    _("custom_name_of_the_cioowner_of_the_company_in_english") + "::350",
    _("custom_registration_number_in_commercial_register") + "::300",
    _("tax_id") + "::120",
    _("customer_primary_contact") + "::200",
    _("custom_email") + "::300",
    _("custom_responsible_persons_name") + "::390",
    _("total_amount: Currency") + "::200"
]

committee_name = filters.get("committee_name")
product_name = filters.get("product_name")
salutation_type = filters.get("salutation_type")
custom_customer_status = filters.get("custom_customer_status")
custom_company_type_ = filters.get("custom_company_type_")
custom_customer_activity_type = filters.get("custom_customer_activity_type")
custom_company_code = filters.get("custom_company_code")
customer_name = filters.get("customer_name")
territory = filters.get("territory")
custom_joining_date = filters.get("custom_joining_date")

sql = """
        SELECT 
            IF(@prev_customer_name = `tabCustomer`.`customer_name`,'' ,`tabCustomer`.`customer_name`)AS `customer_name`,
            @prev_customer_name := `tabCustomer`.`customer_name`, 
            IF(@prev_committee =  `tabCommittees you would like to join`.`committees`, '', `tabCommittees you would like to join`.`committees`) AS `committee_name`,
            @prev_committee := `tabCommittees you would like to join`.`committees`,
            IF(@prev_custom_status = `tabCustomer`.`custom_customer_status`, '', `tabCustomer`.`custom_customer_status`) AS `custom_customer_status`,
            @prev_custom_status := `tabCustomer`.`custom_customer_status`,
            IF(@prev_company_type = `tabCustomer`.`custom_company_type_`, '', `tabCustomer`.`custom_company_type_`) AS `custom_company_type_`,
            @prev_company_type := `tabCustomer`.`custom_company_type_`,
            IF(@prev_activity_type = `tabCustomer`.`custom_customer_activity_type`, '', `tabCustomer`.`custom_customer_activity_type`) AS `custom_customer_activity_type`,
            @prev_activity_type := `tabCustomer`.`custom_customer_activity_type`,
            IF(@prev_territory = `tabCustomer`.`territory`, '', `tabCustomer`.`territory`) AS `territory`,
            @prev_territory := `tabCustomer`.`territory`,
            IF(@prev_joining_date = `tabCustomer`.`custom_joining_date`, '', `tabCustomer`.`custom_joining_date`) AS `custom_joining_date`,
            @prev_joining_date := `tabCustomer`.`custom_joining_date`,
            IF(@prev_company_code = `tabCustomer`.`custom_company_code`, '', `tabCustomer`.`custom_company_code`) AS `custom_company_code`,
            @prev_company_code := `tabCustomer`.`custom_company_code`,
            IF(@prev_customer = `tabCustomer`.`name`, '', `tabCustomer`.`name`) AS `member`,
            @prev_customer := `tabCustomer`.`name`,
            IF(@prev_name_english = `tabCustomer`.`custom_customer_name_in_english`, '', `tabCustomer`.`custom_customer_name_in_english`) AS `customer_name_english`,
            @prev_name_english := `tabCustomer`.`custom_customer_name_in_english`,
            IF(@prev_cio_owner = `tabCustomer`.`custom_name_of_the_cioowner_of_the_company`, '', `tabCustomer`.`custom_name_of_the_cioowner_of_the_company`) AS `custom_name_of_the_cioowner_of_the_company`,
            @prev_cio_owner := `tabCustomer`.`custom_name_of_the_cioowner_of_the_company`,
            IF(@prev_cio_owner_english = `tabCustomer`.`custom_name_of_the_cioowner_of_the_company_in_english`, '', `tabCustomer`.`custom_name_of_the_cioowner_of_the_company_in_english`) AS `custom_name_of_the_cioowner_of_the_company_in_english`,
            @prev_cio_owner_english := `tabCustomer`.`custom_name_of_the_cioowner_of_the_company_in_english`,
            IF(@prev_register_number = `tabCustomer`.`custom_registration_number_in_commercial_register`, '', `tabCustomer`.`custom_registration_number_in_commercial_register`) AS `custom_registration_number_in_commercial_register`,
            @prev_register_number := `tabCustomer`.`custom_registration_number_in_commercial_register`,
            IF(@prev_tax_id = `tabCustomer`.`tax_id`, '', `tabCustomer`.`tax_id`) AS `tax_id`,
            @prev_tax_id := `tabCustomer`.`tax_id`,
           IF(@prev_primary_contact = `tabCustomer`.`customer_primary_contact`, '', `tabCustomer`.`customer_primary_contact`) AS `customer_primary_contact`,
           @prev_primary_contact := `tabCustomer`.`customer_primary_contact`,
           IF(@prev_email = `tabCustomer`.`custom_email`, '', `tabCustomer`.`custom_email`) AS `custom_email`,
           @prev_email := `tabCustomer`.`custom_email`,
           IF(@prev_responsible_persons = `tabCustomer`.`custom_responsible_persons_name`, '', `tabCustomer`.`custom_responsible_persons_name`) AS `custom_responsible_persons_name`,
           @prev_responsible_persons := `tabCustomer`.`custom_responsible_persons_name`,
           (`tabCustomer`.`custom_volume_of__exports`) AS `total_amount`,
  
           IF(@prev_product = `tabCrops that are export`.`product`, '', `tabCrops that are export`.`product`) AS `product_name`,
           @prev_product := `tabCrops that are export`.`product`,
           IF(@prev_salutation = `tabCommittees you would like to join`.`salutation`, '', `tabCommittees you would like to join`.`salutation`) AS `salutation_type`,
           @prev_salutation := `tabCommittees you would like to join`.`salutation`
        FROM 
            `tabCustomer`
        INNER JOIN `tabCommittees you would like to join`
            ON `tabCommittees you would like to join`.`parent` = `tabCustomer`.`name` 
        LEFT JOIN `tabCrops that are export`
            ON `tabCrops that are export`.`parent` = `tabCustomer`.`name`
        CROSS JOIN
            (SELECT 
            @prev_committee := NULL, 
            @prev_customer_name := NULL,
            @prev_custom_status := NULL,
            @prev_company_type := NULL,
            @prev_activity_type := NULL,
            @prev_territory := NULL,
            @prev_joining_date := NULL,
            @prev_company_code := NULL,
            @prev_customer := NULL,
            @prev_name_english := NULL,
            @prev_cio_owner := NULL,
            @prev_cio_owner_english := NULL,
            @prev_register_number := NULL,
            @prev_tax_id := NULL,
            @prev_primary_contact := NULL,
            @prev_email := NULL,
            @prev_responsible_persons := NULL,
            @prev_product := NULL,
            @prev_salutation := NULL) AS var_init
        
            """

if not (committee_name and product_name and salutation_type and custom_customer_status and custom_company_type_ and custom_customer_activity_type and custom_company_code and customer_name and territory and custom_joining_date ):
    mysql =sql+ """
            WHERE(%(product_name)s IS NULL OR `tabCrops that are export`.`product` LIKE %(product_name)s)
                AND (%(salutation_type)s IS NULL OR `tabCommittees you would like to join`.`salutation` LIKE %(salutation_type)s)
                AND (%(custom_customer_status)s IS NULL OR `tabCustomer`.`custom_customer_status` LIKE %(custom_customer_status)s)
                AND (%(custom_company_type_)s IS NULL OR `tabCustomer`.`custom_company_type_` LIKE %(custom_company_type_)s)
                AND (%(custom_customer_activity_type)s IS NULL OR `tabCustomer`.`custom_customer_activity_type` LIKE %(custom_customer_activity_type)s)
                AND (%(custom_company_code)s IS NULL OR `tabCustomer`.`custom_company_code` LIKE %(custom_company_code)s)
                AND (%(customer_name)s IS NULL OR `tabCustomer`.`name` Like %(customer_name)s)
                AND (%(territory)s IS NULL OR `tabCustomer`.`territory` LIKE %(territory)s)
                AND (%(custom_joining_date)s IS NULL OR `tabCustomer`.`custom_joining_date` LIKE %(custom_joining_date)s)
                ORDER BY `tabCustomer`.`customer_name` ASC
        
        """
    mydata = frappe.db.sql(mysql, {
      
        "product_name": f"%{product_name}%" if product_name else None,
        "salutation_type": f"%{salutation_type}%" if salutation_type else None,
        "custom_customer_status": f"%{custom_customer_status}%" if custom_customer_status else None,
        "custom_company_type_": f"%{custom_company_type_}%" if custom_company_type_ else None,
        "custom_customer_activity_type": f"%{custom_customer_activity_type}%" if custom_customer_activity_type else None,
        "custom_company_code": f"%{custom_company_code}%" if custom_company_code else None,
        "customer_name": f"%{customer_name}%" if customer_name else None,
        "territory": f"%{territory}%" if territory else None,
        "custom_joining_date": f"%{custom_joining_date}%" if custom_joining_date else None,
    }, as_dict=True)
if (committee_name):
    if not (product_name):
        mysql =sql+ """
                WHERE 
                     `tabCommittees you would like to join`.`committees` IN %(committee_name)s
            """
        mydata = frappe.db.sql(mysql, {
            "committee_name": committee_name,
        }, as_dict=True)
if (product_name):
    mysql =sql+ """
            WHERE (`tabCrops that are export`.`product` IN %(product_name)s)
                 
        """
    mydata = frappe.db.sql(mysql, {
    
        "product_name": product_name,
    }, as_dict=True)    
if (committee_name and product_name):
    mysql =sql+ """
            WHERE (`tabCrops that are export`.`product` IN %(product_name)s)
                AND (`tabCommittees you would like to join`.`committees` IN %(committee_name)s)
                 
        """
    mydata = frappe.db.sql(mysql, {
        "committee_name": committee_name,
        "product_name": product_name,
    }, as_dict=True)
if (territory):
    mysql =sql+ """
            WHERE (`tabCustomer`.`territory` IN %(territory)s)
                 
        """
    mydata = frappe.db.sql(mysql, {
        "territory": territory,
    }, as_dict=True)
if (territory and committee_name and product_name):
    mysql =sql+ """
            WHERE (`tabCustomer`.`territory` IN %(territory)s)
                AND (`tabCrops that are export`.`product` IN %(product_name)s)
                AND (`tabCommittees you would like to join`.`committees` IN %(committee_name)s)
                 
        """
    mydata = frappe.db.sql(mysql, {
        "territory": territory,
        "product_name":product_name,
        "committee_name":committee_name,
    }, as_dict=True)    
    
# Execute the query with filter values
data = columns, mydata



js

frappe.query_reports['خاص بالاعضاء والتسويق وايضا مديرين النظام'] = {
    "filters": [

      {
            fieldname: "committee_name",
            label: "Please write committee name",
            fieldtype: "MultiSelectList",
            options: "Committee",
            width: "200px",
            get_data: function(txt) {
                if (!frappe.query_report.filters) return;
                let committee_name = "Committee";
                return frappe.db.get_link_options(committee_name,txt);
			
			},
		
            on_change: function(txt) {
                // Handle filter value change here
                frappe.query_report.refresh();
            }
          
        },
      {
            fieldname: "product_name",
            label: "Please select product",
            fieldtype: "MultiSelectList",
            options: "Product",
            width: "200px",  // Set the desired width for the label
           get_data: function(txt) {
            if (!frappe.query_report.filters) return;
            let Product = "Product";
            return frappe.db.get_link_options(Product,txt);
            	},
            on_change: function(txt) {
                // Handle filter value change here
                frappe.query_report.refresh();
            }
        },
       {
            fieldname: "salutation_type",
            label: "Please select salutation type ",
            fieldtype: "Link",
            options: "Salutation",
            width: "200px",  // Set the desired width for the label
        },    
     
     {
            fieldname: "custom_customer_status",
            label: "Please select Membership Status",
            fieldtype: 'Select',
           
            options: [
                '',
                'Requested',
                'Requested From Website',
                'Active',
                'Inactive',
                'Suspended',
                'استيفاء بيانات'
            ],
            default: ''
           
        },
      
        {
            fieldname: "custom_company_type_",
            label: "Please Select Company Type ",
            fieldtype: "Link",
            options: "Company Type",
            width: "350px"
        },
        
         {
            fieldname: "custom_customer_activity_type",
            label: "Please Select customer activity type",
            fieldtype: "Link",
            options:"Customer Activity Type",
            width: "350px",
           
        },
        
        
         {
            fieldname: "territory",
            label: "Please Select Territory",
            fieldtype: "MultiSelectList",
            options:"Territory",
            width: "350px",
           get_data: function(txt) {
            if (!frappe.query_report.filters) return;
            let Territory = "Territory";
            return frappe.db.get_link_options(Territory,txt);
            	},
            on_change: function(txt) {
                // Handle filter value change here
                frappe.query_report.refresh();
            }
        },
        
           {
            fieldname: "custom_joining_date",
            label: "Please Select custom joining date",
            fieldtype: "Date",
            width: "350px",
           
        },
        
        {
             fieldname: "custom_company_code",
             label: "Please Enter company code",
             fieldtype: "Data",
             width: "200px"
        },       
        
    {
    "fieldname": "customer_name",
    "label": __("Customer"),
    "fieldtype": "Link",
     options: "Customer",
     "width": "200px"
 
}
    ]
};  



