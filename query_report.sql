select si.name as "Invoice name:Link/Sales Invoice:300" ,
si.customer as "Customer Name:Link/Customer:200",
cu.customer_type as "Customer Type:Data:200"
from `tabSales Invoice` as si 
left join `tabCustomer` as cu on cu.name=si.customer;

// filter in query report
select * from `tabItem` where date(creation) between %(from_date)s and %(to_date)s ;

// set query

frm.set_query('item_group',function(){
	return "filters":{
		"parent_item_group":"Products"

	}
	})