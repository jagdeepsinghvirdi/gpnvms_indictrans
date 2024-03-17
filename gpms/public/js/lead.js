frappe.ui.form.on("Lead", {
    refresh: function (frm) {
        if(!frm.doc.__islocal){
            frm.add_custom_button(__("Gate Pass"), function () {
                frappe.new_doc('Gate Pass', {"reference_doctype":frm.doc.doctype,"reference_name":frm.doc.name});
            }, __("Create"));
        }
    },
})