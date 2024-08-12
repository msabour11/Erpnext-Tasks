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
