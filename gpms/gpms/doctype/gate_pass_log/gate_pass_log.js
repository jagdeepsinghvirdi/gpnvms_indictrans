// Copyright (c) 2024, Eternal Enterprise Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on("Gate Pass Log", {
    address: function(frm) {
        if (frm.doc.address) {
            frappe.call({
                method: 'frappe.contacts.doctype.address.address.get_address_display',
                args: {
                    address_dict: frm.doc.address
                },
                callback: function(r) {
                    if (r.message) {
                        frm.set_value('address_display', r.message);
                    }
                }
            });
        }
    },
    branch: function (frm) {
        frm.trigger("set_query_filters");
    },
    set_query_filters: function (frm) {
        frm.set_query("gate_pass_location", function (doc) {
            return {
                filters: {
                    branch: frm.doc.branch,
                },
            };
        });
        frm.set_query("purpose", function (doc) {
            return {
                filters: {
                    gate_pass_type: frm.doc.type,
                },
            };
        });
    },
});
