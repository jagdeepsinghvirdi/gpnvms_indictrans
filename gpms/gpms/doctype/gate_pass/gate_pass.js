// Copyright (c) 2024, Eternal Enterprise Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on("Gate Pass", {
    refresh: function (frm) {
        frm.trigger("create_log_button");
    },
    onload: function (frm) {
        if (in_list(["NRGP", "Visitor"], frm.doc.type)) {
            if (!frm.doc.valid_upto) {
                frm.doc.valid_upto = frm.doc.valid_from;
            }
            frm.set_df_property('valid_upto', 'read_only', 1);
        }
        frm.trigger("set_query_filters");
    },
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
    type: function (frm) {
        frm.trigger("set_query_filters");
        frm.trigger("set_valid_date");
    },
    set_valid_date: function (frm) {
        if (in_list(["NRGP", "Visitor"], frm.doc.type)) {
            frm.doc.valid_upto = frm.doc.valid_from;
            frm.set_df_property('valid_upto', 'read_only', 1);
            frm.refresh_field('valid_upto');
        }
        else{
            frm.set_df_property('valid_upto', 'read_only', 0);
        }
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
    clear_items: function (frm) {
        frm.clear_table('gate_pass_item');
        frm.refresh_field('gate_pass_item');
    },
    fetch_items: function (frm) {
        if (frm.doc.reference_doctype && frm.doc.reference_name) {
            frm.clear_table('gate_pass_item');
            frappe.model.with_doc(frm.doc.reference_doctype, frm.doc.reference_name, function () {
                let source_doc = frappe.model.get_doc(frm.doc.reference_doctype, frm.doc.reference_name);
                $.each(source_doc.items, function (index, source_row) {
                    var d = frm.add_child('gate_pass_item')
                    d.item_code = source_row.item_code;
                    d.item_name = source_row.item_name;
                    d.description = source_row.description;
                    d.qty = source_row.qty;
                    d.uom = source_row.uom;
                });
                frm.refresh_field('gate_pass_item');
            });
        }
        else {
            frappe.msgprint(__("Please Select any Reference Doctype / Reference Name"))
        }
    },
    create_log_button: function (frm) {
        if (frm.doc.status == "Active") {
            frm.add_custom_button(__("Check-IN"), function () {
                frappe.model.with_doctype('Gate Pass Log', () => {
                    let gate_pass_log = frappe.model.get_new_doc('Gate Pass Log');
                    gate_pass_log.gate_pass = frm.doc.name,
                    gate_pass_log.log_type = "IN",
                    gate_pass_log.gate_pass_location = frm.doc.gate_pass_location,
                    gate_pass_log.company = frm.doc.company,
                    gate_pass_log.branch = frm.doc.branch,
                    gate_pass_log.contact_person = frm.doc.contact_person,
                    gate_pass_log.first_name = frm.doc.first_name,
                    gate_pass_log.middle_name = frm.doc.middle_name,
                    gate_pass_log.last_name = frm.doc.last_name,
                    gate_pass_log.full_name = frm.doc.full_name,
                    gate_pass_log.mobile_no = frm.doc.mobile_no,
                    gate_pass_log.email_id = frm.doc.email_id,
                    gate_pass_log.vip = frm.doc.vip,
                    gate_pass_log.address = frm.doc.address,
                    gate_pass_log.address_display = frm.doc.address_display,
                    gate_pass_log.address_detail = frm.doc.address_detail,
                    gate_pass_log.identity_card = frm.doc.identity_card,
                    gate_pass_log.type = frm.doc.type,
                    frm.doc.gate_pass_item.forEach((item) => {
                        let child_row = frappe.model.add_child(gate_pass_log, "gate_pass_log_item");
                        child_row.item_code = item.item_code;
                        child_row.item_name = item.item_name;
                        child_row.description = item.description;
                        child_row.qty = item.qty;
                        child_row.uom = item.uom;
                        child_row.gate_pass_item = item.name;
                    });
                    frappe.set_route('Form', 'Gate Pass Log', gate_pass_log.name);
                });
            }, __("Create"));
            frm.add_custom_button(__("Check-OUT"), function () {
                frappe.model.with_doctype('Gate Pass Log', () => {
                    let gate_pass_log = frappe.model.get_new_doc('Gate Pass Log');
                    gate_pass_log.gate_pass = frm.doc.name,
                    gate_pass_log.log_type = "OUT",
                    gate_pass_log.gate_pass_location = frm.doc.gate_pass_location,
                    gate_pass_log.company = frm.doc.company,
                    gate_pass_log.branch = frm.doc.branch,
                    gate_pass_log.contact_person = frm.doc.contact_person,
                    gate_pass_log.first_name = frm.doc.first_name,
                    gate_pass_log.middle_name = frm.doc.middle_name,
                    gate_pass_log.last_name = frm.doc.last_name,
                    gate_pass_log.full_name = frm.doc.full_name,
                    gate_pass_log.mobile_no = frm.doc.mobile_no,
                    gate_pass_log.email_id = frm.doc.email_id,
                    gate_pass_log.vip = frm.doc.vip,
                    gate_pass_log.address = frm.doc.address,
                    gate_pass_log.address_display = frm.doc.address_display,
                    gate_pass_log.address_detail = frm.doc.address_detail,
                    gate_pass_log.identity_card = frm.doc.identity_card,
                    gate_pass_log.type = frm.doc.type,
                    frm.doc.gate_pass_item.forEach((item) => {
                        let child_row = frappe.model.add_child(gate_pass_log, "gate_pass_log_item");
                        child_row.item_code = item.item_code;
                        child_row.item_name = item.item_name;
                        child_row.description = item.description;
                        child_row.qty = item.qty;
                        child_row.uom = item.uom;
                        child_row.gate_pass_item = item.name;
                    });
                    frappe.set_route('Form', 'Gate Pass Log', gate_pass_log.name);
                });
            }, __("Create"));
        }
    },
    valid_from:function(frm){
        frm.trigger("set_valid_date");
    },
    reports_to:function(frm){
        frappe.db.get_value("Employee", {"name": frm.doc.reports_to}, "user_id", (r) => {
            frm.doc.reports_to_email = r.user_id
            frm.refresh_field('reports_to_email');
        });
    }
});