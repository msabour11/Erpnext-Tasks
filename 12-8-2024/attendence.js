// frappe.ui.form.on('Minutes Of Meeting', {
//  refresh: function(frm) {

//         let books = frm.doc.committee_member;
//         let absentCount = 0;
//         let presentCount = 0;
//         for (let row of books) {
//             if (row.meeting_status === "Absent") {
//                 absentCount++;
//             } else if (row.meeting_status === "Present") {
//                 presentCount++;
//             }
//         }

//         console.log("Count of Absent:", absentCount);
//         console.log("Count of Present:", presentCount);
        
//         // Remaining code for chart generation...


        
       
//         const script = `<script src="https://cdn.jsdelivr.net/npm/frappe-charts@1.2.4/dist/frappe-charts.min.iife.js"></script>`;

//         const data = {
//             labels: ["Absent", "Present"],
//             datasets: [
//                 {
//                     name: "Some Data", type: "pie", // Change type to 'pie'
//                     values: [absentCount,presentCount]
//                 }
//             ]
//         };

//         frm.fields_dict.custom_pie_chart.$wrapper.html(`
//             <html>
//             <head>
//                 ${script}
//                 <meta name="viewport" content="width=device-width, initial-scale=1">
//                 <style>
//                     .title {
//                         font-size: 20px;
//                         text-align: center;
//                     }
//                     #chart {
//                         width: 100%;
//                         max-width: 700px;
//                         margin: 0 auto;
//                     }
//                   .graph-svg-tip, .graph-svg-tip > .svg-pointer{
//                         background: #fff;
//                     }
//                     .graph-svg-tip > .title, .graph-svg-tip > .title > strong {
//                         color: #000;
//                     }
//                 </style>
//             </head>
//             <body>
//                 <div class="title">Member Attendance</div>
//                 <div id="chart"></div>

//                 <script>
//                     const data = ${data};
//                     const chart = new frappe.Chart("#chart", {
                      
//                         data: data,
//                         type: 'pie', // Change chart type to 'pie'
//                         height: 300,
//                         colors: ["red", "green"],
                         
//                     });
//                 </script>
//             </body>
//             </html>
//         `);
//  }});



//////////////////////
// frappe.ui.form.on('Minutes Of Meeting', {
//     refresh: function(frm) {
//         let books = frm.doc.committee_member;
//         let absentCount = 0;
//         let presentCount = 0;
//         for (let row of books) {
//             if (row.meeting_status === "Absent") {
//                 absentCount++;
//             } else if (row.meeting_status === "Present") {
//                 presentCount++;
//             }
//         }

//         console.log("Count of Absent:", absentCount);
//         console.log("Count of Present:", presentCount);
        
//         const script = `<script src="https://cdn.jsdelivr.net/npm/frappe-charts@1.2.4/dist/frappe-charts.min.iife.js"></script>`;

//         const chartData = {
//             labels: ["Absent", "Present"],
//             datasets: [
//                 {
//                     name: "Attendance", type: "pie",
//                     values: [absentCount, presentCount]
//                 }
//             ]
//         };

//         frm.fields_dict.custom_pie_chart.$wrapper.html(`
//             <html>
//             <head>
//                 ${script}
//                 <meta name="viewport" content="width=device-width, initial-scale=1">
//                 <style>
//                     .title {
//                         font-size: 20px;
//                         text-align: center;
//                     }
//                     #chart {
//                         width: 100%;
//                         max-width: 700px;
//                         margin: 0 auto;
//                     }
//                     .graph-svg-tip, .graph-svg-tip > .svg-pointer {
//                         background: #fff;
//                     }
//                     .graph-svg-tip > .title, .graph-svg-tip > .title > strong {
//                         color: #000;
//                     }
//                 </style>
//             </head>
//             <body>
//                 <div class="title">Member Attendance</div>
//                 <div id="chart"></div>

//                 <script>
//                     const chartData = ${JSON.stringify(chartData)};
//                     const chart = new frappe.Chart("#chart", {
//                         data: chartData,
//                         type: 'pie',
//                         height: 300,
//                         colors: ["red", "green"]
//                     });
//                 </script>
//             </body>
//             </html>
//         `);
//     }
// });



// frappe.ui.form.on('Minutes Of Meeting', {
//     refresh: function(frm) {
//         let books = frm.doc.committee_member;
//         let absentCount = 0;
//         let presentCount = 0;
//         for (let row of books) {
//             if (row.meeting_status === "Absent") {
//                 absentCount++;
//             } else if (row.meeting_status === "Present") {
//                 presentCount++;
//             }
//         }

//         console.log("Count of Absent:", absentCount);
//         console.log("Count of Present:", presentCount);

//         const chartData = {
//             labels: ["Absent", "Present"],
//             datasets: [
//                 {
//                     name: "Attendance",
//                     type: "pie",
//                     values: [absentCount, presentCount]
//                 }
//             ]
//         };

//         const chartHtml = `
//             <div class="title">Member Attendance</div>
//             <div id="chart"></div>
//         `;

//         frm.fields_dict.custom_pie_chart.$wrapper.html(chartHtml);

//         // Check if the chart container exists in the DOM
//         if (document.getElementById('chart')) {
//             // Initialize the chart
//             const chart = new frappe.Chart("#chart", {
//                 data: chartData,
//                 type: 'pie',
//                 height: 300,
//                 colors: ["red", "green"]
//             });
//         } else {
//             // If the container doesn't exist, wait for the DOM to be ready
//             document.addEventListener('DOMContentLoaded', (event) => {
//                 const chart = new frappe.Chart("#chart", {
//                     data: chartData,
//                     type: 'pie',
//                     height: 300,
//                     colors: ["red", "green"]
//                 });
//             });
//         }
//     }
// });

frappe.ui.form.on('Minutes Of Meeting', {
    refresh: function(frm) {
        let books = cur_frm.doc.committee_member;
        let absentCount = 0;
        let presentCount = 0;
        for (let row of books) {
            if (row.meeting_status === "Absent") {
                absentCount++;
            } else if (row.meeting_status === "Present") {
                presentCount++;
            }
        }

        console.log("Count of Absent:", absentCount);
        console.log("Count of Present:", presentCount);
        
        // Remaining code for chart generation...


        
       
        const script = `<script src="https://cdn.jsdelivr.net/npm/frappe-charts@1.2.4/dist/frappe-charts.min.iife.js"></script>`;

        const data = {
            labels: ["Absent", "Present"],
            datasets: [
                {
                    name: "Some Data", type: "pie", // Change type to 'pie'
                    values: [absentCount,presentCount]
                }
            ]
        };

        frm.fields_dict.custom_pie_chart.$wrapper.html(`
            <html>
            <head>
                ${script}
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    .title {
                        font-size: 20px;
                        text-align: center;
                    }
                    #chart {
                        width: 100%;
                        max-width: 700px;
                        margin: 0 auto;
                    }
                </style>
            </head>
            <body>
                <div class="title">Member Attendance</div>
                <div id="chart"></div>

                <script>
                    const data = ${JSON.stringify(data)};
                    const chart = new frappe.Chart("#chart", {
                      
                        data: data,
                        type: 'pie', // Change chart type to 'pie'
                        height: 300,
                        colors: ["red", "green"]
                    });
                </script>
            </body>
            </html>
        `);
    }}); 
