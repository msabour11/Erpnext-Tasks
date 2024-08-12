def on_submit(self):
          for row in self.get("transactions"):
            if row.paid_from and row.paid_to and row.usd_amount and row.received_amount:
                account_from = get_doc(
                    {
                        "doctype": "GL Entry",
                        "posting_date": nowdate(),
                        "account": row.paid_from,
                        "debit": 0,
                        "credit": row.total_amount,
                        "credit_in_account_currency": row.usd_amount,
                        "remarks": f"Amount {row.currency} {row.usd_amount} transferred from {row.paid_from} to {row.paid_to}",
                        "voucher_type": "Teller Invoice",
                        "voucher_no": self.name,
                        "against": row.paid_to,
                        # "cost_center": row.cost_center,
                        # "project": row.project,
                        "credit_in_transaction_currency": row.total_amount,
                    }
                )
                account_from.insert(ignore_permissions=True).submit()

                account_to = get_doc(
                    {
                        "doctype": "GL Entry",
                        "posting_date": nowdate(),
                        "account": row.paid_to,
                        "debit": row.total_amount,
                        "credit": 0,
                        "debit_in_account_currency": row.total_amount,
                        "credit_in_account_currency": 0,
                        "remarks": f"Amount {row.currency} {row.usd_amount} transferred from {row.paid_from} to {row.paid_to}",
                        "voucher_type": "Teller Invoice",
                        "voucher_no": self.name,
                        "against": row.paid_from,
                        # "cost_center": row.cost_center,
                        # "project": row.project,
                        "debit_in_transaction_currency": row.total_amount,
                        "credit_in_transaction_currency": 0,
                    }
                )
                account_to.insert(ignore_permissions=True).submit()
                if account_from and account_to:
                    # frappe.msgprint(_("GL Entry created successfully for row {0}").format(row.idx))
                    frappe.msgprint(
                        _("Teller Invoice created successfully with  Total {0}").format(
                            self.total
                        )
                    )
                else:
                    frappe.msgprint(
                        _("Failed to create GL Entry for row {0}").format(row.idx)
                    )

            else:
                frappe.throw(
                    _("You must enter all required fields in row {0}").format(row.idx)
                )

       
        # for row in self.get("transactions"):
            if row.paid_from and row.paid_to and row.usd_amount and row.received_amount:
                # Call create_gl_entry function to create GL Entry for each row
                gl_entry = create_gl_entry(
                    account_from=row.paid_from,
                    account_to=row.paid_to,
                    usd_amount=row.usd_amount,
                    credit_amount=row.total_amount,  # Assuming this is the credit amount in GL Entry
                    currency=row.currency,
                    currency_rate=row.rate,
                    voucher_no=self.name,
                    credit_in_transaction_currency=row.total_amount
                    # Assuming the Sales Entry document name is used as the voucher number
                )
                if gl_entry:
                    frappe.msgprint(_("GL Entry created successfully for row {0}").format(row.idx))
                else:
                    frappe.msgprint(_("Failed to create GL Entry for row {0}").format(row.idx))
            else:
                frappe.throw(_("You must enter all required fields in row {0}").format(row.idx))
            