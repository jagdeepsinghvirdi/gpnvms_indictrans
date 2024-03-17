frappe.ui.form.on("Stock Entry", {
    refresh: function (frm) {
        if(frm.doc.docstatus == 1 && frm.doc.stock_entry_type == "Material Transfer"){
            frm.add_custom_button(__("Gate Pass"), function () {
                frappe.new_doc('Gate Pass', {"reference_doctype":frm.doc.doctype,"reference_name":frm.doc.name});
            }, __("Create"));
        }
    },
})