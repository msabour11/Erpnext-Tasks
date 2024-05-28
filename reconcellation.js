

frappe.ui.form.on('Payment Reconciliation', {
 
    receivable_payable_account: function(frm) {
        if (frm.doc.party_type === 'Employee') {
            validate_account(frm);
        }
    }
});

function validate_account(frm) {
    if (!frm.doc.receivable_payable_account) {
        frappe.throw(__('Please select a valid receivable/payable account.'));
        return;
    }

    frappe.call({
        method: 'frappe.client.get_value',
        args: {
            doctype: 'Account',
            filters: { name: frm.doc.receivable_payable_account },
            fieldname: 'name'
        },
        callback: function(r) {
            if (!r.message) {
                frappe.msgprint(__('The account {0} does not exist. Please select a valid account.').format(frm.doc.receivable_payable_account));
                frm.set_value('receivable_payable_account', '');
            }
        }
    });
}

