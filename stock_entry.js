frappe.ui.form.on('Stock Entry', {
	before_submit(frm) {
	      
        
        getModificationsNotDone(frm.doc.work_order).then(modifications => {
            console.log(modifications);
            if(frm.doc.stock_entry_type==="Manufacture"&& modifications.length>0)
            {
                console.log(modifications.length>0)
                frappe.throw(__('Cannot submit Work Order because Modifications  is not done.'));
            }
        });
    
	
	}
})

function getModificationsNotDone(workOrder) {
    // Define the query filters
    const filters = {
        'work_order': workOrder,
        'workflow_state': ['!=', 'Done']
    };

    // Make the API call to get the list of modifications
    return frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Modification',
            filters: filters,
            fields: ['name', 'workflow_state', 'work_order']
        }
    }).then(r => {
        // Return the list of modifications
        return r.message;
    });
}

