frappe.ui.form.on('Authorities Generalization 2', {
    refresh: function(frm) {
        frm.add_custom_button(__('Sent to NewsLetters'), function() {
             let totalCalls = 3;
        frappe.show_progress("Getting Contacts..", 90, 100, "Please wait");
           if (!frm.doc.authorities_committees) {
                my_second_full(frm, totalCalls);
                my_third(frm, totalCalls);
            } else if (!frm.doc.authorities_committees_members) {
                my_full(frm, totalCalls);
                my_third(frm, totalCalls);
            } else if (!frm.doc.custom_the_contact) {
                my_second_full(frm, totalCalls);
                my_full(frm, totalCalls);
            } else {
                my_third(frm, totalCalls);
                my_second_full(frm, totalCalls);
                my_full(frm, totalCalls);
            }
        });
    }
});



function my_full(frm, totalCalls) {
    let filter = {};
    let authorities_committees = frm.doc.authorities_committees;
    let emailes = []; // Declare emails array outside to make it accessible to both functions
    let emos =[];
    for (let AC of authorities_committees) {
        if (AC.status === 'Active') {
            let filter = {'custom_customer_status': 'Active'};
            let filter2 = AC.committee;
            // console.log("filter2",filter2);
            // console.log("is active",AC.status === 'Active');
            frappe.call({
                
                method: "frappe.client.get_list",
                args: {
                    doctype: "Customer",
                    limit_page_length:5000,
                    fields: ['*'],
                    filters: {'custom_customer_status':'Active'}
                },
                callback: function(response) {
                    let customers = response.message;
                    
                    // console.log("customers",customers.length);
                    
                    for (let customer of customers) {
                        // console.log("MY22",customer);
                        let name1 = customer.name;
                        // console.log("memo",customer.name);  
                        let memo = customer.custom_email;
                        frappe.call({
                            method: "frappe.client.get",
                            args: {
                                doctype: "Customer",
                                name: name1
                            },
                            callback: function(response) {
                                let cus = response.message;
                                let zik =[];
                                let committees = cus.custom_committees_you_would_like_to_join;
                                for (let committee of committees) {
                                    zik.push(committee);
                                     if (committee.committees === filter2 && memo !== null) {
                                        // console.log( memo !== null); 
                                        emailes.push(memo);      
                                     }
                                    
                                }
                                            
                                    
                                
                            }
                        });
                    }
                    
                                        
                    
                }
            });
        }
    }

    // After all emails are collected, create the newsletter
    console.log("emos",emos);
    console.log("emails1",emailes);
    console.log("length",emailes.length);
    frappe.new_doc("Customer Newsletter").then(() => {
                                                        for (let email of emailes){
                                                        let child = cur_frm.add_child("customer_email");
                                                        child.email = email;
                                                        cur_frm.refresh_fields("customer_email");                                                                        
                                                  } 
                           frappe.hide_progress();
                    });
console.log("function1");
}



function my_second_full(frm, totalCalls) {
    let authorities_committees_members = frm.doc.authorities_committees_members;
    let emaills = []; // Define emaills array outside of loops

    for (let ACM of authorities_committees_members) {
        let filter3 = ACM.committee;

        frappe.call({
            async: true,
            method: "frappe.client.get_list",
            args: {
                doctype: "Customer",
                limit_page_length: 5000,
                fields: ['*'],
                filters: {'custom_customer_status': 'Active'}
            },
            callback: function(response) {
                let customers = response.message;

                for (let customer of customers) {
                    emos.push(customer.custom_email);
                    frappe.call({
                        async: true,
                        method: "frappe.client.get",
                        args: {
                            doctype: "Customer",
                            name: customer.name,
                        },
                        callback: function(response) {
                            let customer = response.message;
                            let committees = customer.custom_committees_you_would_like_to_join;
                            let meme = customer.custom_email;
                            for (let committee of committees) {
                            if (committee.committees === filter3 && meme !== null && ACM.member === customer.name) {
                                // console.log("validation",committee.committees === filter3 && meme !== null && ACM.member === customer.name);
                                emaills.push(meme);
                            }
                            }
                        }
                    });
                }
            }
        });
     
    }
console.log("emails2", emaills);

        // Add your subsequent logic here, like creating new documents
        frappe.new_doc("Customer Newsletter").then(() => {
            for (let email of emaills) {
                let child = cur_frm.add_child("customer_email");
                child.email = email;
                console.log("emaillllllllllllllll", email);
                cur_frm.refresh_fields("customer_email");
            }
               frappe.hide_progress();
        });
        
   console.log("function2"); 
}

    
    
    
    
    
    
function my_third(frm, totalCalls){
    let contacts = cur_frm.doc.custom_the_contact;
    let emails3 = [];
    for(let contact of contacts){
        let email = contact.email;
         emails3.push(email);
          frappe.new_doc("Customer Newsletter").then(() => {
              for(let email of emails3){
                  let child = cur_frm.add_child("customer_email");
                        child.email = email;
                      
                        cur_frm.refresh_fields("customer_email");
                   
                }
                   frappe.hide_progress();
            });
        
    }
    
   
    console.log("function3");
    console.log("emails3",emails3);
}