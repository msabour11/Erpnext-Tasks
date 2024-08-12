// frappe.ui.form.on('Minutes Of Meeting', {
//     before_load: function(frm) {
//         let books2 = frm.doc.meeting_agenda;
//         let absentCount2 = 0;
//         let presentCount2 = 0;
//         for (let row of books2) {
//             if (row.status === "Completed") {
//                 absentCount2++;
//             } else if (row.status === "Not Completed") {
//                 presentCount2++;
//             }
//         }

//         console.log("Count of Completed:", absentCount2);
//         console.log("Count of Not Completed:", presentCount2);

//         // Define the meeting data for the pie chart
//         const meetingData2 = {
//             labels: ["Completed", "Not Completed"],
//             datasets: [{
//                 name: "Agenda Items",
//                 type: "pie",
//                 values: [absentCount2, presentCount2]
//             }]
//         };
//         console.log('hi ');

//         // Define the HTML, CSS, and JavaScript for the chart
//         const chartHtml = `
//             <div class="title">Meeting Agenda</div>
//             <div id="chart2" style="width: 100%; max-width: 700px; margin: 0 auto;"></div>
//             <script src="https://cdn.jsdelivr.net/npm/frappe-charts@1.2.4/dist/frappe-charts.min.iife.js"></script>
//             <script>
//                 const data2 = ${meetingData2};
//                 const chart2 = new frappe.Chart("#chart2", {
//                     data: data2,
//                     type: 'pie',
//                     height: 300,
//                     colors: ["green", "red"],
//                 });
//             </script>
//         `;

//         // Set the HTML content of the wrapper element
//         frm.fields_dict.custom_agenda_pie.$wrapper.html(chartHtml);
//     }
// });

//  frappe.ui.form.on("Minutes Of Meeting", {
//   onload: function (frm) {
//     let books2 = frm.doc.meeting_agenda;
//     let absentCount2 = 0;
//     let presentCount2 = 0;
//     for (let row of books2) {
//       if (row.status === "Completed") {
//         absentCount2++;
//       } else if (row.status === "Not Completed") {
//         presentCount2++;
//       }
//     }

//     console.log("Count of Completed:", absentCount2);
//     console.log("Count of Not Completed:", presentCount2);

//     // Define the meeting data for the pie chart
//     const meetingData2 = {
//       labels: ["Completed", "Not Completed"],
//       datasets: [
//         {
//           name: "Agenda Items",
//           type: "pie",
//           values: [absentCount2, presentCount2],
//         },
//       ],
//     };

//     frm.fields_dict.custom_agenda_pie.$wrapper.html(
//       `
//             <div class="title">Meeting Agenda</div>
//             <div id="chart2" style="width: 100%; max-width: 700px; margin: 0 auto;"></div>
//             <script src="https://cdn.jsdelivr.net/npm/frappe-charts@1.2.4/dist/frappe-charts.min.iife.js"></script>
//             <script>
//                 const data2 = ${JSON.stringify(meetingData2)};
//                 const chart2 = new frappe.Chart("#chart2", {
//                     data: data2,
//                     type: 'pie',
//                     height: 300,
//                     colors: ["green", "red"],
//                 });
//             </script>`
//     );
//   },
// });
frappe.ui.form.on("Minutes Of Meeting", {
  before_load: function (frm) {
    let books2 = cur_frm.doc.meeting_agenda;
    let absentCount2 = 0;
    let presentCount2 = 0;
    for (let row of books2) {
      if (row.status === "Completed") {
        absentCount2++;
      } else if (row.status === "Not Completed") {
        presentCount2++;
      }
    }

    console.log("Count of Completed:", absentCount2);
    console.log("Count of Not Completed:", presentCount2);

    // Remaining code for chart generation...

    const script2 = `<script src="https://cdn.jsdelivr.net/npm/frappe-charts@1.2.4/dist/frappe-charts.min.iife.js"></script>`;

    let meetingData2 = {
      labels: ["Completed", "Not Completed"],
      datasets: [
        {
          name: "Some2 Data",
          type: "pie", // Change type to 'pie'
          values: [frm.doc.total_completed, frm.doc.total_not_completed],
        },
      ],
    };

    frm.fields_dict.custom_agenda_pie.$wrapper.html(`
            <html>
            <head>
                ${script2}
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    .title {
                        font-size: 20px;
                        text-align: center;
                    }
                    #chart2 {
                        width: 100%;
                        max-width: 700px;
                        margin: 0 auto;
                    }
                </style>
            </head>
            <body>
                <div class="title">Meeting Agenda</div>
                <div id="chart2"></div>

                <script>
                    const data2 = ${JSON.stringify(meetingData2)};
                    const chart2 = new frappe.Chart("#chart2", {
                      
                        data: data2,
                        type: 'pie', // Change chart type to 'pie'
                        height: 300,
                        colors: ["green", "red"]
                    });
                </script>
            </body>
            </html>
        `);
  },
});
