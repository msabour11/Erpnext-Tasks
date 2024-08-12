SELECT 
    A.posting_date AS `Date`,
    A.name AS `Invoice`,
    A.customer AS `Customer`, 
    A.set_warehouse AS `Warehouse`, 
    A.status AS `Status`, 
    A.grand_total AS `Total Amount`, 
    A.total_taxes_and_charges AS `Total Taxes`,
    A.outstanding_amount AS `Remaining Bill`, 
    B.paid_amount AS `Paid Amount`, 
    B.payment_type AS `Payment Type`
FROM 
    `tabSales Invoice` AS A 
JOIN 
    `tabPayment Entry` AS B ;



SELECT Clause
This part of the query specifies the columns to be retrieved from the database and assigns them more readable aliases for the report:
A.posting_date AS 'Date': Retrieves the posting date of the sales invoice and labels it as "Date".
A.name AS 'Invoice': Retrieves the invoice identifier and labels it as "Invoice".
A.customer AS 'Customer': Retrieves the customer associated with the invoice.
A.set_warehouse AS 'Warehouse': Retrieves the warehouse where the items were stored or dispatched.
A.status AS 'Status': Retrieves the current status of the invoice (e.g., Paid, Unpaid, Cancelled).
A.grand_total AS 'Total Amount': Retrieves the total amount of the invoice including taxes.
A.total_taxes_and_charges AS 'Total Taxes': Retrieves the total amount of taxes and other charges applied to the invoice.
A.outstanding_amount AS 'Remaining Bill': Retrieves the amount still owed by the customer on the invoice.
B.paid_amount AS 'Paid Amount': Retrieves the amount that has been paid towards the invoice.
B.payment_type AS 'Payment Type': Retrieves the type of payment used (e.g., Cash, Credit Card, Bank Transfer).

