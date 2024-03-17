from frappe.custom.doctype.custom_field.custom_field import (
    create_custom_fields as _create_custom_fields,
)


CUSTOM_FIELDS = {
    "Employee": [
        {
            "fieldname": "company_mobile_no",
            "fieldtype": "Data",
            "options": "Phone",
            "label": "Company Mobile No",
            "description": "Provide Mobile Number registered in company",
            "insert_after": "cell_number",
        },
    ],
}


def execute():
    create_custom_fields()


def create_custom_fields():
    _create_custom_fields(CUSTOM_FIELDS, update=True)
