frappe.ui.form.on('Committee', {
	before_save:function(frm) {
	  
		if(frm.doc.committee_chairman){
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
                            
                            
        let current_date = frappe.datetime.get_today();
	    frm.set_value('chairman_from',current_date)
	    console.log("date",frm.doc.chairman_from);
		let last_entry=frm.doc.president_history[frm.doc.president_history.length-1];
		console.log(last_entry)
		if(frm.doc.president_history.length===0)
		{
		    let row=frm.add_child('president_history');
		    row.member=frm.doc.committee_chairman;
		    row.from=frm.doc.chairman_from;
		    console.log('created new member');
		}
		
		
		else if (last_entry&&frm.doc.committee_chairman!==last_entry.member)
		{
		  //  last_entry.to=frm.doc.chairman_from
		    last_entry.to=frm.doc.chairman_from
		    const date_from=new Date(last_entry.from)
		    const date_to = new Date(last_entry.to)
		    const diff_time=Math.abs(date_to - date_from)
		    console.log(diff_time)
		    const diff_days=Math.ceil(diff_time / (1000 * 60 * 60 * 24))
		    console.log(diff_days)
		    let str_diff_days=diff_days.toString()
		    last_entry.duration=str_diff_days
		    frm.refresh_field('president_history')

		    
		    let row=frm.add_child('president_history')
		    row.member=frm.doc.committee_chairman
		    row.from=frm.doc.chairman_from
		   console.log('date type,',typeof(row.from))
		    frm.refresh_field('president_history')
		}
                            
            ///////////////////////////////////////////////
           
                            
         
                  
                  
                
		  
	
		     
     
		    
		}  
		
		
		
		
		/////////////////////////////////////////////////////////
		
		if (frm.doc.agents_committee)
		{
		    
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
        let current_date = frappe.datetime.get_today();
	    frm.set_value('deputy_from',current_date)
	    console.log("date",frm.doc.deputy_from);
		let last_entry=frm.doc.deputy_history[frm.doc.deputy_history.length-1];
		console.log(last_entry)
		if(frm.doc.deputy_history.length===0)
		{
		    let row=frm.add_child('deputy_history');
		    row.member=frm.doc.agents_committee;
		    row.from=frm.doc.deputy_from;
		    console.log('created new member');
		}
		else if (last_entry&&frm.doc.agents_committee!==last_entry.member)
		{
		  //  last_entry.to=frm.doc.chairman_from
		    last_entry.to=frm.doc.deputy_from
		    const date_from=new Date(last_entry.from)
		    const date_to = new Date(last_entry.to)
		    const diff_time=Math.abs(date_to - date_from)
		    console.log(diff_time)
		    const diff_days=Math.ceil(diff_time / (1000 * 60 * 60 * 24))
		    console.log(diff_days)
		     let str_diff_days=diff_days.toString()
		    last_entry.duration=str_diff_days
		    frm.refresh_field('deputy_history')

		    
		    let row=frm.add_child('deputy_history')
		    row.member=frm.doc.agents_committee
		    row.from=frm.doc.deputy_from
		   console.log('date type,',typeof(row.from))
		    frm.refresh_field('deputy_history')
		}
          
                            
                
		    
		}
		
		
		
			
		
	}
})







