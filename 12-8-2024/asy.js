frappe.ui.form.on("Purchase Order", {
    refresh(frm) {
        // Uncomment the condition if needed
        // if (frm.doc.workflow_state === "مراجعة المدير المالي") {
        get_po(frm).then(poResults => {
            console.log("Purchase Order Totals:", poResults);

            get_monthly_distribution(frm, poResults).then(allocatedAmounts => {
                // Ensure this is logged only once
                console.log("Allocated Amounts:", allocatedAmounts);
            }).catch(error => {
                console.error("Error in get_monthly_distribution:", error);
            });
        }).catch(error => {
            console.error("Error in get_po:", error);
        });
        // }
    }
});

async function get_po(frm) {
    let results = {}; // Object to store totals by expense account
    let today = new Date(frm.doc.transaction_date);
    let startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    let endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    try {
        let purchaseOrders = await new Promise((resolve, reject) => {
            frappe.call({
                method: "frappe.client.get_list",
                args: {
                    doctype: "Purchase Order",
                    limit_page_length: 5000,
                    fields: ["name"],
                    filters: [
                        ["docstatus", "=", 1],
                        ["transaction_date", ">=", startOfMonth],
                        ["transaction_date", "<", endOfMonth],
                    ],
                },
                callback: function (r) {
                    r.message ? resolve(r.message) : reject("Failed to fetch Purchase Orders.");
                }
            });
        });

        if (purchaseOrders.length > 0) {
            let responses = await Promise.all(purchaseOrders.map(order =>
                new Promise((resolve, reject) => {
                    frappe.call({
                        method: "frappe.client.get",
                        args: {
                            doctype: "Purchase Order",
                            name: order.name,
                            fields: ["items"],
                        },
                        callback: function (r) {
                            r.message ? resolve(r.message) : reject("Failed to fetch Purchase Order details.");
                        }
                    });
                })
            ));

            responses.forEach(response => {
                let allPurchaseOrderItems = response.items || [];
                allPurchaseOrderItems.forEach(item => {
                    let amount = item.amount || 0;
                    let expense_account = item.expense_account || '';

                    if (expense_account) {
                        if (!results[expense_account]) {
                            results[expense_account] = { total_amount: 0 };
                        }
                        results[expense_account].total_amount += amount;
                    }
                });
            });
        } else {
            console.error("No Purchase Orders found.");
        }

    } catch (error) {
        console.error("Error in get_po function", error);
    }

    return results;
}

async function get_budget(frm) {
    let today = new Date(frm.doc.transaction_date);
    let PO_year = today.getFullYear();

    try {
        let results = await get_po(frm);
        console.log("Results", results);

        let budgetDetails = {}; // Initialize budgetDetails as an object

        for (let expense_account in results) {
            if (results.hasOwnProperty(expense_account)) {
                let result = results[expense_account];
                console.log(Expense Account: ${expense_account});
                console.log(Total Amount: ${result.total_amount});
                console.log('---');

                let budgetResponse = await new Promise((resolve, reject) => {
                    frappe.call({
                        method: "frappe.client.get_list",
                        args: {
                            doctype: "Budget",
                            limit_page_length: 5000,
                            fields: ["name", "cost_center"],
                            filters: [
                                ["docstatus", "=", 1],
                                ["fiscal_year", "=", PO_year],
                            ],
                            limit: 1,
                        },
                        callback: function (r) {
                            r.message ? resolve(r.message) : reject("Failed to fetch budget details.");
                        }
                    });
                });

                if (budgetResponse.length > 0) {
                    let budget = budgetResponse[0];

                    let budgetDocResponse = await new Promise((resolve, reject) => {
                        frappe.call({
                            method: "frappe.client.get",
                            args: {
                                doctype: "Budget",
                                name: budget.name,
                                fields: ["accounts"],
                            },
                            callback: function (r) {
                                r.message ? resolve(r.message) : reject("Failed to fetch budget document details.");
                            }
                        });
                    });

                    if (budgetDocResponse) {
                        let table_budget_items = budgetDocResponse.accounts;

                        // Loop through budget items and combine them into one object
                        table_budget_items.forEach(item => {
                            budgetDetails = {
                                ...item, // Merge current item into budgetDetails
                                cost_center: budgetDocResponse.cost_center // Ensure cost_center is added/updated
                            };
                        });
                    } else {
                        console.error("Failed to fetch budget document details.");
                    }
                } else {
                    console.log("No budgets found for the current year.");
                }
            }
        }

         console.log("ff",budgetDetails);

    } catch (error) {
        console.error("Error in get_budget function", error);
        throw error; // Re-throw the error to be handled by the caller
    }
}


async function get_monthly_distribution(frm, poResults) {
    try {
        let budgetDetails = await get_budget(frm);
        console.log("Budget Details:", budgetDetails);
        
        let monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let po_month = new Date(frm.doc.transaction_date);
        let currentMonthIndex = po_month.getMonth(); // Zero-based index

        let allocatedAmounts = [];

        for (let budget of budgetDetails) {
            let budget_accounts_table = budget.item; // Access the accounts array from the budget item
            console.log("Accounts Table:", budget_accounts_table);

            let monthlyDistResponse = await new Promise((resolve, reject) => {
                frappe.call({
                    method: "frappe.client.get",
                    args: {
                        doctype: "Monthly Distribution",
                        name: budget_accounts_table.monthly_distribution,
                        fields: ["percentages"],
                    },
                    callback: function (r) {
                        r.message ? resolve(r.message) : reject("Failed to fetch monthly distribution.");
                    }
                });
            });

            let child = monthlyDistResponse.percentages;
            child.forEach(row => {
                if (row.month === monthList[currentMonthIndex]) {
                    let allocatedAmount = (row.percentage_allocation * budget_accounts_table.budget_amount) / 100;
                    let totalAmount = poResults[budget_accounts_table.account] ? poResults[budget_accounts_table.account].total_amount : 0;
                    console.log("totalAmount",poResults[budget_accounts_table.account].total_amount);
                    allocatedAmounts.push({
                        "account": budget_accounts_table.account,
                        "cost center": budget.cost_center,
                        "budget monthly": allocatedAmount,
                        "total amount": totalAmount // Add total amount for the account
                    });
                }
            });
        }

        // Ensure allocatedAmounts is logged only once
        console.log("Final Allocated Amounts:", allocatedAmounts);
        // return allocatedAmounts;

    } catch (error) {
        console.error("Error in get_monthly_distribution:", error);
        throw error; // Re-throw the error to be handled by the caller
    }
     console.log("Final Allocated Amount22s:", allocatedAmounts);
}
