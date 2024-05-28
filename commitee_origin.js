frappe.ui.form.on('Committee', {
	before_save:function(frm) {
	  
		if(frm.doc.committee_chairman && frm.doc.agents_committee){
		    frappe.call({
                                method: "barcode_aec.update_president.update_committee",
                                args: {
                                    com:frm.doc.name,
                                    emp: frm.doc.committee_chairman,
                                    salutation: 'عضوية رئيس لجنة'
                                  
                                    
                                },
                                callback: function(response) {
                                    console.log('Member Updated');
                                }
                                
                            });
                            
            var existingEntry = false;
            frm.doc.president_history.forEach(function(row) {
                if (row.member === frm.doc.committee_chairman) {
                    existingEntry = true;
                    console.log('Dup Detected'); 
                    return false; //
                    
                }
            });
                            
            if (!existingEntry) {   
                var from_date = new Date(frm.doc.chairman_from);
                var to_date = new Date(frm.doc.chairman_to);
                var duration = Math.floor((to_date - from_date) / (1000 * 60 * 60 * 24)); 
                    frm.add_child('president_history', {
                    'member': cur_frm.doc.committee_chairman,
                    'from': cur_frm.doc.chairman_from ,
                    'to' :cur_frm.doc.chairman_to,
                    'duration': duration
 
                });
                frm.refresh_field('president_history');
                
                  }
                  
                  
                  ////////////////////////////////////////////////////////////////////////////
		    frappe.call({
                                method: "barcode_aec.update_president.update_committee",
                                args: {
                                    com:frm.doc.name,
                                    emp: frm.doc.agents_committee,
                                    salutation: 'عضوية وكيل لجنة'
                                  
                                    
                                },
                                callback: function(response) {
                                    console.log('Member Updated 2');
                                }
                                
                            });
	
		      var existingEntry2 = false;
            frm.doc.deputy_history.forEach(function(row) {
                if (row.member === frm.doc.agents_committee) {
                    existingEntry2 = true;
                    console.log('Dup Detected'); 
                    return false; //
                    
                }
            });
                if (!existingEntry2) {   
                var from_date2 = new Date(frm.doc.deputy_from);
                var to_date2 = new Date(frm.doc.deputy_to);
                var duration2 = Math.floor((to_date2 - from_date2) / (1000 * 60 * 60 * 24)); 
                    frm.add_child('deputy_history', {
                    'member': cur_frm.doc.agents_committee,
                    'from': cur_frm.doc.deputy_from ,
                    'to' :cur_frm.doc.deputy_to,
                    'duration': duration2
 
                });
                frm.refresh_field('deputy_history');
		    
		}    
// 		else if(frm.doc.agents_committee){
		    	 //   frappe.call({
        //                         method: "barcode_aec.update_president.update_committee",
        //                         args: {
        //                             com:frm.doc.name,
        //                             emp: frm.doc.agents_committee,
        //                             salutation: 'عضوية وكيل لجنة'
                                  
                                    
        //                         },
        //                         callback: function(response) {
        //                             console.log('Member Updated');
        //                         }
                                
        //                     });
		    
		    
// 		}
		
		
		}	
		
	}
	
	
// 	update_president:function(frm) {
	    
// 	       var existingEntry = false;
//             frm.doc.president_history.forEach(function(row) {
//                 if (row.member === frm.doc.committee_chairman) {
//                     existingEntry = true;
//                     console.log('Dup Detected'); 
//                     return false; //
                    
//                 }
//             });
            
            
            
//       if (!existingEntry) {   
//                 var from_date = new Date(frm.doc.chairman_from);
//                 var to_date = new Date(frm.doc.chairman_to);
//                 var duration = Math.floor((to_date - from_date) / (1000 * 60 * 60 * 24)); 
//                     frm.add_child('president_history', {
//                     'member': cur_frm.doc.committee_chairman,
//                     'president_name': cur_frm.doc.chairman_arabic_name,
//                     'from': cur_frm.doc.chairman_from ,
//                     'to' :cur_frm.doc.chairman_to,
//                     'duration': duration
 
//                 });
//                 frm.refresh_field('president_history');
//                 frm.set_value('chairman_from', '');
//                 frm.set_value('chairman_to', '');
//                 frm.set_value('committee_chairman', '');
//                 frm.set_value('chairman_english_name', '');
//                 frm.set_value('chairman_arabic_name', '');


//                 frm.save();

//                   }
	    
		

		
// 	},
	
// 	update_deputy:function(frm){
	    
// 	     var existingEntry2 = false;
//             frm.doc.deputy_history.forEach(function(row) {
//                 if (row.member === frm.doc.agents_committee) {
//                     existingEntry2 = true;
//                     console.log('Dup Detected'); 
//                     return false; //
                    
//                 }
//             });
//                 if (!existingEntry2) {   
//                 var from_date2 = new Date(frm.doc.deputy_from);
//                 var to_date2 = new Date(frm.doc.deputy_to);
//                 var duration2 = Math.floor((to_date2 - from_date2) / (1000 * 60 * 60 * 24)); 
//                     frm.add_child('deputy_history', {
//                     'member': cur_frm.doc.agents_committee,
//                     'from': cur_frm.doc.deputy_from ,
//                     'to' :cur_frm.doc.deputy_to,
//                     'duration': duration2
 
//                 });
//                 frm.refresh_field('deputy_history');
// 	           // frm.refresh_field('president_history');
//                 frm.set_value('deputy_from', '');
//                 frm.set_value('deputy_to', '');
//                 frm.set_value('agent_english_name', '');
//                 frm.set_value('agents_committee', '');

//                 frm.set_value('agent_arabic_name', '');

//                 frm.save();
	    
	    
	    
	    
	    
	    
	    
	    
//                 } 
// 	}
	
})






// frappe.ui.form.on('Committee', {
// 	committee_chairman:function(frm) {
		
// 		let chair = frm.doc.committee_chairman;
// 		let from = frm.doc.chairman_from;
// 		let current_date = frappe.datetime.get_today();
// 		console.log(current_date);
		
// 		if(chair){
		    
// 		    frm.set_value('chairman_from', current_date);
// 		    frm.refresh_field('chairman_from');
		    
		    
		    
		    
// 		}
		
		
// 	}
// })
