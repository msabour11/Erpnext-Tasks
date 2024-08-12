frappe.ui.form.on('Payment Entry', {
    mode_of_payment_per_check: function(frm) {
    if(frm.doc.check_list) {
          for(let check of frm.doc.check_list) {
              check.originl_mode_of_payment = frm.doc.mode_of_payment_per_check;
          }  
    }
    
      refresh_field('check_list');
    },
    check_date: function(frm) {
      if(frm.doc.check_date) {
        let d = new Date(frm.doc.check_date);
        if(frm.doc.check_list) {
           for(let i of frm.doc.check_list) {
               d.setMonth(d.getMonth() + 1);
               i.due_date = d.toISOString().split('T')[0];
           }
           refresh_field('check_list');
        }
      }
    },
    check_amount: function(frm) {
      if(frm.doc.check_amount && frm.doc.check_list) {
          for(let i of frm.doc.check_list) {
              i.amount = frm.doc.check_amount;
          }
          refresh_field('check_list');
      }  
    },
    number_of_checks: function(frm) {
        for(let i= 0; i < parseInt(frm.doc.number_of_checks); i++)
            frm.add_child('check_list');
        refresh_field('check_list');
    },
    mode_of_payment: function(frm) {
      frappe.call({
            method: 'frappe.client.get',
            args: {
                'doctype': 'Mode of Payment',
                'name': frm.doc.mode_of_payment
            },
            callback: function(r) {
                let t = r.message.type;
                if(t == "Cash") {
                    frm.set_value("check_list", []);
                    frm.set_df_property("checks_info", "hidden", 1);
                    cur_frm.set_df_property("transaction_references", "hidden", 1);
                    frm.set_value("mode_of_payment_per_check", frm.doc.mode_of_payment);
                } else {
                    frm.set_value("mode_of_payment_per_check", "");
                }
            }
      }) 
    },
    
    before_save: function(frm) {
        frappe.call({
            method: 'frappe.client.get',
            args: {
                'doctype': 'Account',
                'name': frm.doc.paid_from
            },
            callback: function(r) {
                if(r.message && r.message.account_type === 'Bank') {
                    let total_amount = 0;
                    try {
                        if(frm.doc.check_list.length == 1) 
                            total_amount = parseFloat(frm.doc.check_list[0].amount);
                        else 
                            total_amount = frm.doc.check_list.reduce((a, b) => 
                                                parseFloat(a.amount) + parseFloat(b.amount));
                    } catch(e) {}
                
                    if(frm.doc.cheque_status === "Open" && total_amount !== parseFloat(frm.doc.paid_amount))
                        frappe.throw("Check the total cheque amount");         
                }
            }
        });
        
        if(frm.doc.references && frm.doc.references[0]?.reference_doctype === 'Fees') {
            frappe.call({
                method: 'frappe.client.get_value',
                args: {
                    'doctype': 'Fees',
                    'fieldname': ['fee_structure', 'student', 'program'],
                    'filters': {'name': frm.doc.references[0].reference_name}
                    
                },
                callback: function(r) {
                    frm.doc.program_name = r.message.program;
                    frm.doc.fee_structure = r.message.fee_structure;
                    frappe.call({
                        method: 'frappe.client.get_value',
                        args: {
                            'doctype': 'Fee Structure',
                            'fieldname': ['program', 'academic_term'],
                            'filters': {'name': r.message.fee_structure }
                        },
                        callback: function(r) {
                            frm.doc.academic_term = r.message.academic_term;
                        }
                    })
                    frappe.call({
                        method: 'frappe.client.get_value',
                        args: {
                            'doctype': 'Student',
                            'fieldname': ['customer'],
                            'filters': {'name': r.message.student}
                        },
                        callback: function(r) {
                            frm.doc.customer_number = r.message.customer;        
                        }
                    })
                }
            })
            
            
        }
    },
    
    after_cancel: function(frm) {
        try {
            frm.doc.check_list.map(check => frappe.db.delete_doc("Check", check.check_no));
        } catch(e) {}
    },
    onload: function(frm) {
        let invoice = '';
        try {
                invoice = frm.doc.references[0].reference_name;
        }
        catch(err) {}

        if(frm.doc.to_mode_of_payment) {
            frappe.call({
                method: 'frappe.client.get',
                args: {
                    'doctype': 'Mode of Payment',
                    'name': frm.doc.to_mode_of_payment
                },
                callback: function(r) {
                    frappe.model.set_value("Payment Entry", frm.doc.name, "paid_to", r.message.accounts[0].default_account);
                }
            });
        }
            

        
        if(invoice){
            if (frm.doc.check_list  && frm.doc.check_list.length === 0 &&
                frm.doc.references[0].reference_doctype == 'Sales Invoice'){
            frappe.call({
                    method: 'frappe.client.get',
                    args: {
                            'doctype': 'Sales Invoice',
                            'name': invoice
                    },
                     callback: function(r) {
                        if (!r.exc) {
                            if(r.message.payment_schedule_cur.length > 0)
                                r = r.message.payment_schedule_cur;
                            else 
                                r = r.message.payment_schedule;
                                
                            frm.doc.check_list = [];
                            get_mode_of_payment(frm.doc.mode_of_payment).then((resp) => {
                                if(resp.message.type != "Cash") {
                                    
                                    r.forEach((check) => {
                                        const entry = frm.add_child('check_list');
                                        entry.due_date = check.due_date;
                                        entry.amount = check.invoice_amount;
                                        refresh_field('check_list');
                                    });
                                }
                            });
                        }
                    }
                });
        }
        }
    },
    customer_bank: function(frm) {
            const bank = frm.doc.customer_bank;
                    if(bank) {
                            frm.doc.check_list.forEach((check) => {
                                    check.bank = bank;
                            });
                            refresh_field('check_list');
                    }
    },
        
    check_no: function(frm) {
            let serial = parseInt(frm.doc.check_no);
            frm.doc.check_list.forEach((check) => {
                    if(serial) {
                            check.check_no = serial;
                            serial += 1;
                    }
                    else {
                            check.check_no = '';
                    }
            });
            refresh_field('check_list');
    },
before_submit:function(frm) {
		// your code here
		    frm.doc.check_list.forEach(check => {
		        if(!check.check_no) {
		            frappe.throw("Check number required");
		        }
		    })
		
			var doc = locals[frm.doc.doctype][frm.doc.name];
			if (doc.check_list)
			{
		   $.each(doc.check_list, function(i, d) {
		       
		       	
		       
		     var check = {
                'doctype': 'Check',
                'check_no': cur_frm.doc.check_list[i].check_no,
                'due_date': cur_frm.doc.check_list[i].due_date,
                'bank': cur_frm.doc.check_list[i].bank,
                'amount': cur_frm.doc.check_list[i].amount,
                'status': 'Open',
                'originl_mode_of_payment': cur_frm.doc.mode_of_payment,
                'party_type': cur_frm.doc.party_type,
                'party': cur_frm.doc.party,
                'party_name': cur_frm.doc.party_name,
                'paid_from': cur_frm.doc.paid_to,
                'affected_account': cur_frm.doc.check_list[i].originl_mode_of_payment
            }
            
         
              //      msgprint(cur_frm.doc.check_list[i].check_no);

           
            console.log(check)
            frappe.db.insert(check).then(doc => {
                console.log("Inserted");
           // 	frm.save_or_update();
            //	frappe.set_route("Form", "Sales Invoice", doc.name)
            })
		       
         
        });

            }
if ( cur_frm.doc.cheque_)

{
 //           msgprint(cur_frm.doc.cheque_status);
 // msgprint( cur_frm.doc.paid_to);
  
       
    
        frappe.call({
        method: 'frappe.client.set_value',
        'args': {
          'doctype': 'Check',
          'name': cur_frm.doc.cheque_,
          fieldname: {
            'status':cur_frm.doc.cheque_status,
             'paid_from':cur_frm.doc.paid_to
          },
        }
        });
   // frappe.model.set_value("Check", cur_frm.doc.cheque_, "Status", cur_frm.doc.cheque_status)
   //frappe.model.set_value("Check", cur_frm.doc.cheque_, "paid_from", cur_frm.doc.paid_to)



}
 //     msgprint('Completed');

   
   
   

}

});

// after_cancel: function(frm) {
//     try {
//         frm.doc.check_list.map(check => frappe.db.delete_doc("Check", check.check_no));
//     } catch(e) {}
// },


function get_mode_of_payment(mode) {
    return frappe.call({
        method: 'frappe.client.get_value',
        args: {
            'doctype': 'Mode of Payment',
            fieldname: ['type'],
            filters: {'name': mode}
        }
    })
}


frappe.ui.form.on('Payment Entry', {
 refresh: function(frm, cdt, cdn) {
        
  if ( frm.doc.docstatus != 1) {
      frm.toolbar.print_icon.hide();

    }


    }
});


frappe.ui.form.on('Payment Entry', {
 onload: function(frm) {
        
  if ( frm.doc.sales_taxes_and_charges_template == 'غرامة 1 % - كاش الشيكات - TC') {
       refresh_field('taxes');
    }


    }
});

// frappe.ui.form.on('Payment Entry', {
//     refresh (frm) {
//                 frappe.call({
//                 method: 'frappe.client.get',
//                 args: {
//                         doctype: 'Fees',
//                         name: 'program'
//                 },
//                  callback: function(r) {
//                     if (!r.exc) {
//                         program=r.message.program;
//                 }
//             }
//                         });
//           cur_frm.refresh_field('program');
        
//     }
// });
// frappe.ui.form.on("Fees", {
//     refresh: function(frm) {
//         frappe.call({
//             method: "frappe.client.get",
//             args: {
//                 doctype: "Fees",
//                 filters: { name: frm.doc.name },
//                 fieldname: "program"
//             },
//             callback: function(response) {
//                 if (response.message && response.message.program) {
//                     frappe.cur_page.fields_dict.program.set_value(response.message.program);
//                     frm.refresh_field("program");
//                 }
//             }
//         });
//     }
// });
