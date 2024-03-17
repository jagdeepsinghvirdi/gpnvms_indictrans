# Copyright (c) 2024, Eternal Enterprise Technologies and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class GatePassLog(Document):
	def on_submit(self):
		self.update_check_qty()
	
	def on_cancel(self):
		self.update_check_qty()
	
	def update_check_qty(self):
		if self.log_type == "IN":
			for item in self.gate_pass_log_item:
				if item.item_code and item.gate_pass_item:
					total_in_qty = frappe.db.get_value("Gate Pass Log Item",{"docstatus":1,"gate_pass_item":item.gate_pass_item,"item_code":item.item_code},["sum(in_qty)"]) or 0
					frappe.db.set_value("Gate Pass Item",item.gate_pass_item,"in_qty",total_in_qty)
		if self.log_type == "OUT":
			for item in self.gate_pass_log_item:
				if item.item_code and item.gate_pass_item:
					total_out_qty = frappe.db.get_value("Gate Pass Log Item",{"docstatus":1,"gate_pass_item":item.gate_pass_item,"item_code":item.item_code},["sum(out_qty)"]) or 0
					frappe.db.set_value("Gate Pass Item",item.gate_pass_item,"out_qty",total_out_qty)
		if frappe.get_value("Gate Pass",{"name":self.gate_pass},["type"]) == "RGP":
			gate_pass_item = frappe.qb.DocType("Gate Pass Item")
			gate_pass_status = (
				frappe.qb.from_(gate_pass_item)
				.select(gate_pass_item.name, gate_pass_item.in_qty, gate_pass_item.out_qty)
				.where(
					(gate_pass_item.parent == self.gate_pass)
					& (gate_pass_item.in_qty != gate_pass_item.out_qty)
				)
			).run(as_dict=True)
			if not gate_pass_status:
				frappe.db.set_value("Gate Pass",self.gate_pass,"status","Completed")