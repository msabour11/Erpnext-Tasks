frappe.ui.form.on('Production requirements card', {
	refresh(frm) {
	    
	    frm.set_query('customer',function(doc){
		    return {
		       
		        "filters":{
		            "custom_customer_status":"Active"
		        }
		    }
		})
	
	},
	validate(frm){
	  let today = frappe.datetime.get_today();
        if (frm.doc.custom_end_date && frm.doc.custom_end_date <= today) {
            frappe.msgprint(__('End date must be a future date.'));
            frappe.validated = false;
        }
        //
         if (frm.doc.custom_end_date_of_tax && frm.doc.custom_end_date_of_tax <= today) {
            frappe.msgprint(__('End date must be a future date.'));
            frappe.validated = false;
        }
        
         if (frm.doc.custom_end_datee && frm.doc.custom_end_datee <= today) {
            frappe.msgprint(__('End date must be a future date.'));
            frappe.validated = false;
        }
        
	}
})