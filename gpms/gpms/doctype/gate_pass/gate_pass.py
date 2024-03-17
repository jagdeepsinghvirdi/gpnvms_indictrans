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