// attendee

frappe.ui.form.on("Minutes Of Meeting", {
  refresh: function (frm) {
    let books = frm.doc.committee_member;
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

    const chartData = {
      labels: ["Absent", "Present"],
      datasets: [
        {
          name: "Attendance",
          type: "pie",
          values: [absentCount, presentCount],
        },
      ],
    };

    const chartHtml = `
            <div class="title">Member Attendance</div>
            <div id="chart"></div>
        `;

    frm.fields_dict.custom_pie_chart.$wrapper.html(chartHtml);

    // Check if the chart container exists in the DOM
    if (document.getElementById("chart")) {
      // Initialize the chart
      const chart = new frappe.Chart("#chart", {
        data: chartData,
        type: "pie",
        height: 300,
        colors: ["red", "green"],
      });
    } else {
      // If the container doesn't exist, wait for the DOM to be ready
      document.addEventListener("DOMContentLoaded", (event) => {
        const chart = new frappe.Chart("#chart", {
          data: chartData,
          type: "pie",
          height: 300,
          colors: ["red", "green"],
        });
      });
    }
  },
});


// agenda
frappe.ui.form.on("Minutes Of Meeting", {
  before_load: function (frm) {
    let books2 = frm.doc.meeting_agenda;
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

    const chartData = {
      labels: ["Complete", "Incomplete"],
      datasets: [
        {
          name: "Agenda",
          type: "pie",
          values: [absentCount2, presentCount2],
        },
      ],
    };

    const chartHtml = `
    <div class="title">Member Agenda</div>
    <div id="chart"></div>
`;

    frm.fields_dict.custom_agenda_pie.$wrapper.html(chartHtml);

    if (document.getElementById("chart")) {
      // Initialize the chart
      const chart = new frappe.Chart("#chart", {
        data: chartData,
        type: "pie",
        height: 300,
        colors: ["red", "green"],
      });
    } else {
      // If the container doesn't exist, wait for the DOM to be ready
      document.addEventListener("DOMContentLoaded", (event) => {
        const chart = new frappe.Chart("#chart", {
          data: chartData,
          type: "pie",
          height: 300,
          colors: ["red", "green"],
        });
      });
    }
  },
});


//////////////////////////////////////////////////



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
//         if (document.getElementById('chart1')) {
//             // Initialize the chart
//             const chart = new frappe.Chart("#chart1", {
//                 data: chartData,
//                 type: 'pie',
//                 height: 300,
//                 colors: ["red", "green"]
//             });
//         } else {
//             // If the container doesn't exist, wait for the DOM to be ready
//             document.addEventListener('DOMContentLoaded', (event) => {
//                 const chart = new frappe.Chart("#chart1", {
//                     data: chartData,
//                     type: 'pie',
//                     height: 300,
//                     colors: ["red", "green"]
//                 });
//             });
//         }
        
//     /////////////////////////////helloe
//      let books2 = frm.doc.meeting_agenda;
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

//     const chartData2 = {
//       labels: ["Complete", "Incomplete"],
//       datasets: [
//         {
//           name: "Agenda",
//           type: "pie",
//           values: [absentCount2, presentCount2],
//         },
//       ],
//     };

//     const chartHtml2 = `
//     <div class="title">Member Agenda</div>
//     <div id="chart"></div>
// `;

//     frm.fields_dict.custom_agenda_pie.$wrapper.html(chartHtml2);

//     if (document.getElementById("chart")) {
//       // Initialize the chart
//       const chart = new frappe.Chart("#chart", {
//         data: chartData2,
//         type: "pie",
//         height: 300,
//         colors: ["red", "green"],
//       });
//     } else {
//       // If the container doesn't exist, wait for the DOM to be ready
//       document.addEventListener("DOMContentLoaded", (event) => {
//         const chart = new frappe.Chart("#chart", {
//           data: chartData,
//           type: "pie",
//           height: 300,
//           colors: ["red", "green"],
//         });
//       });
//     }
//     }
// });

frappe.ui.form.on('Minutes Of Meeting', {
    refresh: function(frm) {
        let books = frm.doc.committee_member;
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

        const chartData = {
            labels: ["Absent", "Present"],
            datasets: [
                {
                    name: "Attendance",
                    type: "pie",
                    values: [absentCount, presentCount]
                }
            ]
        };

        const chartHtml = `
            <div class="title">Member Attendance</div>
            <div id="chartAttendance"></div>
        `;

        frm.fields_dict.custom_pie_chart.$wrapper.html(chartHtml);

        // Check if the chart container exists in the DOM
        if (document.getElementById('chartAttendance')) {
            // Initialize the chart
            const chart = new frappe.Chart("#chartAttendance", {
                data: chartData,
                type: 'pie',
                height: 300,
                colors: ["red", "green"]
            });
        } else {
            // If the container doesn't exist, wait for the DOM to be ready
            document.addEventListener('DOMContentLoaded', (event) => {
                const chart = new frappe.Chart("#chartAttendance", {
                    data: chartData,
                    type: 'pie',
                    height: 300,
                    colors: ["red", "green"]
                });
            });
        }
        
        /////////////////////////////helloe
        let books2 = frm.doc.meeting_agenda;
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

        const chartData2 = {
            labels: ["Complete", "Incomplete"],
            datasets: [
                {
                    name: "Agenda",
                    type: "pie",
                    values: [absentCount2, presentCount2],
                },
            ],
        };

        const chartHtml2 = `
            <div class="title">Member Agenda</div>
            <div id="chartAgenda"></div>
        `;

        frm.fields_dict.custom_agenda_pie.$wrapper.html(chartHtml2);

        if (document.getElementById("chartAgenda")) {
            // Initialize the chart
            const chart = new frappe.Chart("#chartAgenda", {
                data: chartData2,
                type: "pie",
                height: 300,
                colors: ["green", "red"],
            });
        } else {
            // If the container doesn't exist, wait for the DOM to be ready
            document.addEventListener("DOMContentLoaded", (event) => {
                const chart = new frappe.Chart("#chartAgenda", {
                    data: chartData,
                    type: "pie",
                    height: 300,
                    colors: ["green", "red"],
                });
            });
        }
    }
});



