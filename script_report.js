columns = [
    _("item_name")+"::150",
    _("fiscal_year")+"::150",
    _("January")+"::150",
    _("February")+"::150",
    _("March")+"::150",
    _("April")+"::150",
    _("May")+"::150",
    _("June")+"::150",
    _("july")+"::150",
    _("August")+"::150",
    _("September")+"::150",
    _("October")+"::150",
    _("December")+"::150",
    _("total_quantity")+"::150",
    _("total")+"::150"
    
      
    ]
    
     #Get values from filters or set them to None
    fiscal_year = filters.get("fiscal_year")
    item_name = filters.get("item_name")
    sql = """SELECT 
             `tabBudget Items Details`.`item_name`,
             `tabBudget Request`.`fiscal_year`,
              SUM(`tabBudget Items Details`.`january`) AS `january`,
              SUM(`tabBudget Items Details`.`february`) AS `february`, 
              SUM(`tabBudget Items Details`.`march`) AS `march`,
              SUM(`tabBudget Items Details`.`april`) AS `april`,
              SUM(`tabBudget Items Details`.`may`) AS `may`,
              SUM(`tabBudget Items Details`.`june`) AS `june`,
              SUM(`tabBudget Items Details`.`july`) AS `july`, 
              SUM(`tabBudget Items Details`.`august`) AS `august`,
              SUM(`tabBudget Items Details`.`september`) AS `september`, 
              SUM(`tabBudget Items Details`.`october`) AS `october`,  
              SUM(`tabBudget Items Details`.`november`) AS `november`,  
              SUM(`tabBudget Items Details`.`december`) AS `december`,
              SUM(`tabBudget Items Details`.`total_quantity`) AS `total_quantity`,
              SUM(`tabBudget Items Details`.`total`)  AS `total`
         
             
             
        FROM
            `tabBudget Request`
        JOIN `tabBudget Items Details` 
        ON `tabBudget Request`.`name` = `tabBudget Items Details`.`parent`
        JOIN `tabItem`
        ON `tabBudget Items Details`.`item_name` = `tabItem`.`name`
        JOIN `tabBudget`
        ON `tabBudget`.`custom_budget_request_reference` = `tabBudget Request`.`name`
        WHERE (%(item_name)s IS NULL OR `tabBudget Items Details`.`item_name` LIKE %(item_name)s)
        AND
        (%(fiscal_year)s IS NULL OR `tabBudget Request`.`fiscal_year` LIKE %(fiscal_year)s)
        AND `tabBudget`.`docstatus` = "1"
        AND `tabBudget Request`.`docstatus`='1'
        
        GROUP BY `tabBudget Items Details`.`item_name`, `tabBudget Request`.`fiscal_year`
        
      """
    
    
    mydata = frappe.db.sql(sql,{"item_name":  f"%{item_name}%" if item_name else None,
                                "fiscal_year": f"%{fiscal_year}%" if fiscal_year else None
                              }, as_dict=True)
    
    data =columns,mydata


    //////////////////////////////


    frappe.query_reports['تقرير الموازنة للاصناف'] ={
        "filters":[
              {   fieldname:"item_name",
                label:"please  put your Item",
                fieldtype:"Link",
                options:"Item",
                width:"200px"
            
            },
        
            {   fieldname:"fiscal_year",
                label:"please  put your fiscal",
                fieldtype:"Link",
                options:"Fiscal Year",
                width:"200px"
            
            }
        
        ]
    
    
    }
    
    
    frappe.query_report._get_filters_html_for_print = frappe.query_report.get_filters_html_for_print;
    frappe.query_report.get_filters_html_for_print = print_settings => {
      const me = frappe.query_report,
            encode = svg => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent((new XMLSerializer()).serializeToString(svg));
      let applied_filters = me._get_filters_html_for_print();
    
      // Check if the report name matches
      if (me.report_name === "تقرير الموازنة للاصناف") {
        // Add your onload functionality here
        // For example:
        console.log("Special onload functionality for تقرير الموازنة للاصناف");
      }
    
      if (me.chart && me.chart.svg) {
         applied_filters += `<hr><img alt="${__('Chart')}" src="${encode(me.chart.svg)}" />`;
      }
    
      return applied_filters;
    };
    
    // select custom_code_ ,custom_department,custom_parent_designation,designation_name ,current ,total,vacancies from `tabDesignation` join `tabJob Planning` on `tabDesignation`.`name` = `tabDesignation`.`parent`;
    /* 

    select designation_name,custom_parent_designation, custom_code_ ,
    branch,custom_department ,current ,total,vacancies from 
    `tabDesignation` as d join `tabJob Planning` as jp on d.name = jp.parent;
    */