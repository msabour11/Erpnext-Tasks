frappe.ui.form.on('To whom it may concern', {
	refresh(frm) {
		frm.set_query('customer',function(doc){
		    return {
		       
		        "filters":{
		            "custom_customer_status":"Active"
		        }
		    }
		})
	}
})