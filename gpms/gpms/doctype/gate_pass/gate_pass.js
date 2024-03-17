// Copyright (c) 2024, Eternal Enterprise Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on("Gate Pass", {
    refresh: function (frm) {
        frm.trigger("create_log_button");
    },
    onload: function (frm) {
        frm.trigger("set_valid_date");
        frm.trigger("set_query_filters");
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
            if (!frm.doc.valid_upto) {
                frm.doc.valid_upto = frm.doc.valid_from;
            }
            frm.set_df_property('valid_upto', 'read_only', 1);
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
            frm.add_custom_button(__("Create Check-IN"), function () {
                frappe.model.with_doctype('Gate Pass Log', () => {
                    let gate_pass_log = frappe.model.get_new_doc('Gate Pass Log');
                    gate_pass_log.gate_pass = frm.doc.name,
                    gate_pass_log.log_type = "IN",
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
            }, __("Actions"));
            frm.add_custom_button(__("Create Check-OUT"), function () {
                frappe.model.with_doctype('Gate Pass Log', () => {
                    let gate_pass_log = frappe.model.get_new_doc('Gate Pass Log');
                    gate_pass_log.gate_pass = frm.doc.name,
                    gate_pass_log.log_type = "OUT",
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
            }, __("Actions"));
        }
    }
});
