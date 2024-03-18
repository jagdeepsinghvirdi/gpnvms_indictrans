# Copyright (c) 2024, Eternal Enterprise Technologies and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import getdate, nowdate


class GatePass(Document):
	pass

def validate_gate_pass_status():
	gate_pass_list = frappe.db.get_all("Gate Pass",{"status":"Active"},["*"])
	for gp in gate_pass_list:
		if gp.valid_upto < getdate(nowdate()):
			frappe.db.set_value("Gate Pass",gp.name,"status","Expired")
	return


@frappe.whitelist()
def get_contact_address(doc,reference_doctype,reference_name):
	if (reference_doctype == "Customer"):
		details = frappe.db.get_all(reference_doctype,{"name":reference_name},["customer_primary_address","customer_primary_contact"])
		contact = details[0].get("customer_primary_contact") or ""
		address = details[0].get("customer_primary_address") or ""
		return address, contact
	elif (reference_doctype == "Supplier"):
		details = frappe.db.get_all(reference_doctype,{"name":reference_name},["supplier_primary_address","supplier_primary_contact"])
		contact = details[0].get("supplier_primary_contact") or ""
		address = details[0].get("supplier_primary_address") or ""
		return address, contact
	elif (reference_doctype == "Sales Order"):
		details = frappe.db.get_all(reference_doctype,{"name":reference_name},["customer_address","contact_person"])
		contact = details[0].get("contact_person") or ""
		address = details[0].get("customer_address") or ""
		return address, contact
	elif (reference_doctype == "Purchase Order"):
		details = frappe.db.get_all(reference_doctype,{"name":reference_name},["supplier_address","contact_person"])
		contact = details[0].get("contact_person") or ""
		address = details[0].get("supplier_address") or ""
		return address, contact
	elif (reference_doctype == "Delivery Note"):
		details = frappe.db.get_all(reference_doctype,{"name":reference_name},["customer_address","contact_person"])
		contact = details[0].get("contact_person") or ""
		address = details[0].get("customer_address") or ""
		return address, contact