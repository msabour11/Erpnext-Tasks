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
