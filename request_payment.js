// custom script 0018
frappe.ui.form.on('Purchase Order', {
	refresh(frm) {
			if (frm.doc.docstatus==0) {
						frm.add_custom_button(
							__("Payment Request"),
							function () {
								makePaymentRequest(frm);
							},
						);
					}
	}
})
function makePaymentRequest(frm) {
    frappe.call({
        method: 'erpnext.accounts.doctype.payment_request.payment_request.make_payment_request',
        args: {
            dt: 'Purchase Order',
            dn: frm.doc.name,
            recipient_id: frm.doc.supplier,
            payment_request_type: 'Inward',
            party_type: 'Supplier',
            party: frm.doc.supplier,
            grand_total: frm.doc.grand_total,
            currency: frm.doc.currency,
            company: frm.doc.company,
            transaction_date: frappe.datetime.nowdate(),
            
        },
        callback: function(response) {
            if (response.message) {
                frappe.set_route('Form', 'Payment Request', response.message.name);
                console.log(response.message)
            }
        }
    });
}
