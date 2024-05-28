payment_type: (frm) {
        //   frappe.msgprint('hello')  
          if (frm.doc.payment_type==="Pay")
          {frm.set_value('naming_series','PAY-')}
          else if (frm.doc.payment_type==='Receive')
          //Internal Transfer
          {frm.set_value('naming_series'==='ACC-REC-2023-2024-')}
          else {frm.set_value('naming_series'==='ACC-TRN-2023-2024-')}
          
        
    }

    
