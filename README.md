# EKERP
Enterprise Resource Planning

# COMPANY
Company run a procurement business workflow
## Company Structure
### Departments Structure
```bash
| Department                | Code |
| ------------------------- | ---- |
| Management                | MG   |
| Procurement               | PR   |
| Sales                     | SL   |
| Business Development      | BD   |
| Tender                    | TD   |
| Project Management        | PM   |
| Operations                | OP   |
| Logistics                 | LG   |
| Warehouse                 | WH   |
| Supply Chain              | SC   |
| Finance                   | FN   |
| Accounting                | AC   |
| Finance & Accounting      | FA   |
| Human Resources           | HR   |
| General Affairs           | GA   |
| HR & GA                   | HG   |
| Legal                     | LE   |
| Compliance                | CP   |
| Quality Assurance         | QA   |
| Quality Control           | QC   |
| Information Technology    | IT   |
| Customer Service          | CS   |
| Health Safety Environment | HS   |
```

### Positions Structure
```bash
| Position          | Code | Level |
| ----------------- |:----:|:-----:|
| Director          | DR   | 1     |
| General Manager   | GM   | 2     |
| Manager           | MG   | 3     |
| Assistant Manager | AM   | 4     |
| Supervisor        | SP   | 5     |
| Team Leader       | TL   | 6     |
| Coordinator       | CO   | 6     |
| Senior Staff      | SS   | 7     |
| Specialist        | SC   | 7     |
| Analyst           | AN   | 7     |
| Staff             | ST   | 8     |
| Officer           | OF   | 8     |
| Administrator     | AD   | 8     |
| Technician        | TC   | 8     |
| Operator          | OP   | 8     |
| Inspector         | IN   | 8     |
| Recruiter         | RC   | 8     |
| Accountant        | AC   | 8     |
| Storekeeper       | SK   | 8     |
| Junior Staff      | JS   | 9     |
| Intern            | IT   | 9     |
| Trainee           | TR   | 9     |

```

# SYSTEM DESIGN
## Module
### Human Resource Information System


# PREPARATION
## Create Database

### HRIS

**TABLE: company_data**
```sql
CREATE TABLE company_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    alamat VARCHAR(100) NOT NULL,
    kelurahan VARCHAR(100) NOT NULL,
    kecamatan VARCHAR(100) NOT NULL,
    kota VARCHAR(100) NOT NULL,
    provinsi VARCHAR(100) NOT NULL,
    negara VARCHAR(100) NOT NULL,
    kode_pos VARCHAR(20) NOT NULL,
    email VARCHAR(50) NOT NULL,
    nomor_telepon VARCHAR(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: departments**
```sql
CREATE TABLE departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    department_code VARCHAR(2) NOT NULL UNIQUE,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: positions**
```sql
CREATE TABLE positions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    position_code VARCHAR(2) NOT NULL UNIQUE,
    position_name VARCHAR(100) NOT NULL,
    level INT(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: department_position**
```sql
CREATE TABLE department_position (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    department_id BIGINT NOT NULL,
    position_id BIGINT NOT NULL,
    job_code VARCHAR(3) NOT NULL UNIQUE,
    job_name VARCHAR(100) NOT NULL,
    basic_salary BIGINT NOT NULL,
    allowance BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_positions_department
        FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    UNIQUE KEY uk_department_position (
        department_id,
        position_name
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: ptkp_status**
```sql
CREATE TABLE ptkp_status (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    value DECIMAL(18, 2) NOT NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: employees**
```sql
CREATE TABLE employees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_code VARCHAR(20) NOT NULL UNIQUE,

    department_sequence_join INT(3) NOT NULL,
    position_sequence_join INT(3) NOT NULL,

    name VARCHAR(255) NOT NULL,
    gender ENUM('male', 'female') DEFAULT NULL,
    address TEXT,
    date_of_birth DATE,

    email VARCHAR(255) NOT NULL UNIQUE,
    telephone_number VARCHAR(20),

    bank_name VARCHAR(100),
    account_number VARCHAR(30),

    ptkp_id BIGINT,

    join_date DATE NOT NULL,

    position_id BIGINT NOT NULL,

    password VARCHAR(255) NOT NULL,

    image_path TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,

    INDEX idx_employee_position (position_id),

    CONSTRAINT fk_employees_position
        FOREIGN KEY (position_id)
        REFERENCES department_position(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_employees_ptkp
        FOREIGN KEY (ptkp_id)
        REFERENCES ptkp_status(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: employment_status**
```sql
CREATE TABLE employment_status (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: employee_employment_status**
```sql
CREATE TABLE employee_employment_status (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    status_id BIGINT NOT NULL,
    employee_id BIGINT NOT NULL,
    start_work DATE NOT NULL,
    end_work DATE DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_employees_status_id
        FOREIGN KEY (status_id)
        REFERENCES employment_status(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_employees_employment_id
        FOREIGN KEY (employee_id)
        REFERENCES employees(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: roles**
```sql
CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```


**TABLE: permissions**
```sql
CREATE TABLE permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    module_name VARCHAR(50) NOT NULL, -- cth: 'Vendor', 'Procurement', 'HR'
    action VARCHAR(50) NOT NULL,
    permission_name VARCHAR(100) NOT NULL UNIQUE, -- cth: 'create_po', 'approve_payroll'
    description VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: employee_roles**
```sql
CREATE TABLE employee_roles (
    employee_id BIGINT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (employee_id, role_id),
    CONSTRAINT fk_er_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    CONSTRAINT fk_er_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: role_permissions**
```sql
CREATE TABLE role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_rp_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_rp_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: attendance**
```sql
CREATE TABLE attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    employee_id BIGINT NOT NULL,
    attendance_date DATE NOT NULL,

    check_in TIME NULL,
    check_out TIME NULL,

    late_minutes INT DEFAULT 0,
    early_leave_minutes INT DEFAULT 0,

    status ENUM(
        'Hadir',
        'Izin',
        'Sakit',
        'Alpha',
        'Libur'
    ) DEFAULT 'Alpha',

    work_hours DECIMAL(5,2) DEFAULT 0,
    overtime_hours DECIMAL(5,2) DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_attendance_employee (employee_id),

    UNIQUE KEY uk_attendance_employee_date (
        employee_id,
        attendance_date
    ),

    CONSTRAINT fk_attendance_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: type_letter**
```sql
CREATE type_letter (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    letter_type VARCHAR(50) NOT NULL,
    letter_code VARCHAR(3) UNIQUE NOT NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: sequence_of_letter**
```sql
CREATE sequence_of_letter (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type_letter VARCHAR(3) NOT NULL,
    month_period TINYINT NOT NULL,
    year_period YEAR NOT NULL,
    sequence INT NOT NULL,

    CONSTRAINT fk_type_letter
        FOREIGN KEY (type_letter)
        REFERENCES type_letter(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Finance
**TABLE: invoices**
```sql
CREATE TABLE invoices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    project_id BIGINT NOT NULL,
    client_id BIGINT NOT NULL,
    
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    
    subtotal BIGINT NOT NULL DEFAULT 0,
    tax_amount BIGINT DEFAULT 0,
    discount_amount BIGINT DEFAULT 0,
    grand_total BIGINT NOT NULL,
    
    payment_status ENUM('UNPAID', 'PARTIAL', 'PAID') DEFAULT 'UNPAID',
    status ENUM('DRAFT', 'SENT', 'CANCELLED') DEFAULT 'DRAFT',
    
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_inv_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE RESTRICT,
    CONSTRAINT fk_inv_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE RESTRICT,
    CONSTRAINT fk_inv_created_by FOREIGN KEY (created_by) REFERENCES employees(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: invoice_items**
```sql
CREATE TABLE invoice_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    item_description VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_price BIGINT NOT NULL,
    total_price BIGINT NOT NULL,
    
    CONSTRAINT fk_inv_item_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Procurement
**TABLE: transaction**
```sql
CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_number VARCHAR(50) NOT NULL UNIQUE,
    transaction_date DATE NOT NULL,
    
    -- Polymorphic relationship to other tables like payroll, purchase_orders, etc.
    related_entity_type VARCHAR(50) NOT NULL COMMENT 'e.g., payroll, purchase_order', 
    related_entity_id BIGINT NOT NULL,
    
    amount BIGINT NOT NULL,
    type ENUM('DEBIT', 'CREDIT') NOT NULL,
    description TEXT,
    
    payment_status_id INT NOT NULL,
    processed_by BIGINT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_transaction_related_entity (related_entity_type, related_entity_id),
    INDEX idx_transaction_status (payment_status_id),
    INDEX idx_transaction_processed_by (processed_by),
    
    CONSTRAINT fk_transactions_payment_status
        FOREIGN KEY (payment_status_id)
        REFERENCES payment_status(id)
        ON UPDATE CASCADE,

    CONSTRAINT fk_transactions_processed_by
        FOREIGN KEY (processed_by)
        REFERENCES employees(id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: deduction**
```sql
CREATE TABLE deduction (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT,
    name_deduction VARCHAR(100) NOT NULL,
    deduction_value BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_employee_deduction FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: payroll**
```sql
CREATE TABLE payroll (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    employee_id BIGINT NOT NULL,

    payroll_month TINYINT NOT NULL,
    payroll_year YEAR NOT NULL,

    basic_salary BIGINT DEFAULT 0,
    allowance BIGINT DEFAULT 0,
    bonus BIGINT DEFAULT 0,
    overtime_pay BIGINT DEFAULT 0,
    deduction BIGINT DEFAULT 0,
    tax BIGINT DEFAULT 0,
    bpjs BIGINT DEFAULT 0,

    total_salary BIGINT NOT NULL,

    payment_date DATE,

    generated_by BIGINT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_payroll_employee (employee_id),
    INDEX idx_payroll_generated_by (generated_by),

    UNIQUE KEY uk_payroll_period (
        employee_id,
        payroll_month,
        payroll_year
    ),

    CONSTRAINT fk_payroll_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_payroll_generated_by
        FOREIGN KEY (generated_by)
        REFERENCES employees(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: payment_status**
```sql
CREATE TABLE payment_status (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: chart_of_account**
```sql
CREATE TABLE chart_of_accounts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    account_code VARCHAR(20) NOT NULL UNIQUE, -- cth: '1100' untuk Kas Bank, '4100' untuk Pendapatan
    account_name VARCHAR(100) NOT NULL,
    account_type ENUM('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE') NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_coa_type (account_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: journal_entries**
```sql
CREATE TABLE journal_entries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    entry_number VARCHAR(50) NOT NULL UNIQUE, -- Nomor Bukti Jurnal
    entry_date DATE NOT NULL,
    reference_type VARCHAR(50) NULL, -- cth: 'INVOICE', 'BILL', 'PAYROLL'
    reference_id BIGINT NULL,
    description TEXT,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_journal_date (entry_date),
    CONSTRAINT fk_journal_created_by FOREIGN KEY (created_by) REFERENCES employees(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: journal_entry_lines**
```sql
CREATE TABLE journal_entry_lines (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    journal_entry_id BIGINT NOT NULL,
    account_id INT NOT NULL,
    debit BIGINT DEFAULT 0,
    credit BIGINT DEFAULT 0,
    description VARCHAR(255),
    
    CONSTRAINT fk_jel_journal FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id) ON DELETE CASCADE,
    CONSTRAINT fk_jel_account FOREIGN KEY (account_id) REFERENCES chart_of_accounts(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: vendor_bills**
```sql
CREATE TABLE vendor_bills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bill_number VARCHAR(50) NOT NULL UNIQUE, -- Nomor Tagihan dari Vendor
    po_id BIGINT NOT NULL,
    vendor_id BIGINT NOT NULL,
    
    bill_date DATE NOT NULL,
    due_date DATE NOT NULL,
    
    total_amount BIGINT NOT NULL,
    payment_status ENUM('UNPAID', 'PARTIAL', 'PAID') DEFAULT 'UNPAID',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_bill_po FOREIGN KEY (po_id) REFERENCES purchase_orders(id) ON DELETE RESTRICT,
    CONSTRAINT fk_bill_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Warehouse

**TABLE: category**
```sql
CREATE TABLE category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category_code VARCHAR(50) NOT NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: warehouse**
```sql
CREATE TABLE warehouses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    warehouse_code VARCHAR(20) UNIQUE,

    warehouse_name VARCHAR(100) NOT NULL,

    address TEXT,

    manager_id BIGINT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (manager_id)
        REFERENCES employees(id)
);
```

**TABLE: items**
```sql
CREATE TABLE items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_code VARCHAR(50) NOT NULL UNIQUE,
    item_name VARCHAR(255) NOT NULL,
    category_id BIGINT NOT NULL,
    unit_of_measure VARCHAR(20) NOT NULL, -- cth: 'Pcs', 'Box', 'Kg', 'Lisensi'
    base_price BIGINT NOT NULL DEFAULT 0,
    
    type ENUM('Goods', 'Service') NOT NULL DEFAULT 'Goods',
    status ENUM('Active', 'Archived') DEFAULT 'Active',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_item_category (category),
    CONSTRAINT fk_ct_category FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```


**TABLE: goods_receipts**
```sql
CREATE TABLE goods_receipts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    po_id BIGINT NOT NULL,

    receipt_number VARCHAR(50) NOT NULL UNIQUE,

    receipt_date DATE NOT NULL,

    received_by BIGINT NOT NULL,

    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (po_id)
        REFERENCES purchase_orders(id),

    FOREIGN KEY (received_by)
        REFERENCES employees(id)
);
```

**TABLE: good_receipt_items**
```sql
CREATE TABLE goods_receipt_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    goods_receipt_id BIGINT NOT NULL,

    po_item_id BIGINT NOT NULL,

    received_qty INT NOT NULL,

    accepted_qty INT DEFAULT 0,

    rejected_qty INT DEFAULT 0,

    notes TEXT,

    FOREIGN KEY (goods_receipt_id)
        REFERENCES goods_receipts(id),

    FOREIGN KEY (po_item_id)
        REFERENCES po_items(id)
);
```

**TABLE: inventory_stocks**
```sql
CREATE TABLE inventory_stocks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    warehouse_id BIGINT NOT NULL,

    item_id BIGINT NOT NULL,

    quantity DECIMAL(18,2) DEFAULT 0,

    minimum_stock DECIMAL(18,2) DEFAULT 0,

    maximum_stock DECIMAL(18,2) DEFAULT 0,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_stock (
        warehouse_id,
        item_id
    ),

    FOREIGN KEY (warehouse_id)
        REFERENCES warehouses(id),

    FOREIGN KEY (item_id)
        REFERENCES items(id)
);
```

**TABLE: stock_movements**
```sql
CREATE TABLE stock_movements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    item_id BIGINT NOT NULL,

    warehouse_id BIGINT NOT NULL,

    movement_type ENUM(
        'IN',
        'OUT',
        'TRANSFER',
        'ADJUSTMENT'
    ) NOT NULL,

    quantity DECIMAL(18,2) NOT NULL,

    reference_type VARCHAR(50),

    reference_id BIGINT,

    movement_date DATETIME NOT NULL,

    notes TEXT,

    created_by BIGINT,

    FOREIGN KEY (item_id)
        REFERENCES items(id),

    FOREIGN KEY (warehouse_id)
        REFERENCES warehouses(id),

    FOREIGN KEY (created_by)
        REFERENCES employees(id)
);
```

### Procurement

**TABLE: purchase_request**
```sql
CREATE TABLE purchase_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pr_number VARCHAR(50) NOT NULL UNIQUE,
    department_id BIGINT NOT NULL,
    requested_by BIGINT NOT NULL,
    
    request_date DATE NOT NULL,
    required_date DATE NOT NULL,
    
    status ENUM('Draft', 'Submitted', 'Manager_Approved', 'Finance_Approved', 'Rejected', 'Processed') DEFAULT 'Draft',
    total_estimated_value BIGINT DEFAULT 0,
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_pr_status (status),
    CONSTRAINT fk_pr_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
    CONSTRAINT fk_pr_requested_by FOREIGN KEY (requested_by) REFERENCES employees(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: purchase_orders**
```sql
CREATE TABLE purchase_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    po_number VARCHAR(50) NOT NULL UNIQUE,

    source_type ENUM('client_quotation', 'purchase_requests') NOT NULL,
    source_id BIGINT NOT NULL,

    vendor_id BIGINT NOT NULL,
    created_by BIGINT NOT NULL,
    
    po_date DATE NOT NULL,
    expected_delivery_date DATE NOT NULL,
    
    subtotal BIGINT NOT NULL,
    tax_amount BIGINT DEFAULT 0,
    shipping_cost BIGINT DEFAULT 0,
    grand_total BIGINT NOT NULL,
    
    status ENUM('Draft', 'Sent_to_Vendor', 'On_Delivery', 'Completed', 'Cancelled') DEFAULT 'Draft',
    payment_status ENUM('Unpaid', 'Partial', 'Paid') DEFAULT 'Unpaid',
    
    terms_and_conditions TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_po_status (status),
    CONSTRAINT fk_po_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE RESTRICT,
    CONSTRAINT fk_po_created_by FOREIGN KEY (created_by) REFERENCES employees(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: po_items**
```sql
CREATE TABLE po_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    po_id BIGINT NOT NULL,
    item_id BIGINT NOT NULL,
    
    quantity INT NOT NULL,
    unit_price BIGINT NOT NULL,
    total_price BIGINT NOT NULL, -- quantity * unit_price
    
    CONSTRAINT fk_po_item_po FOREIGN KEY (po_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_po_item_item FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: pr_items**
```sql
CREATE TABLE pr_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pr_id BIGINT NOT NULL,
    item_id BIGINT NOT NULL,
    
    requested_quantity INT NOT NULL,
    estimated_unit_price BIGINT DEFAULT 0,
    total_estimated BIGINT DEFAULT 0,
    
    notes VARCHAR(255),
    
    CONSTRAINT fk_pr_item_pr FOREIGN KEY (pr_id) REFERENCES purchase_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_pr_item_item FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```


**TABLE: industries**
```sql
CREATE TABLE industries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL
)
```

**TABLE: vendors**
```sql
CREATE TABLE vendors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_code VARCHAR(20) NOT NULL UNIQUE,
    company_name VARCHAR(255) NOT NULL,
    pic_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telephone_number VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    npwp VARCHAR(30) UNIQUE,
    
    rating DECIMAL(3,2) DEFAULT 0.00, -- Range 0.00 - 5.00
    status ENUM('ACTIVE', 'SUSPENDED', 'BLACKLISTED') DEFAULT 'ACTIVE',
    
    created_by BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    
    INDEX idx_vendor_status (status),
    CONSTRAINT fk_vendors_created_by FOREIGN KEY (created_by) REFERENCES employees(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: vendor_evaluations**
```sql
CREATE TABLE vendor_evaluations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    vendor_id BIGINT NOT NULL,

    project_id BIGINT NOT NULL,

    quality_score DECIMAL(5,2),
    delivery_score DECIMAL(5,2),
    communication_score DECIMAL(5,2),
    price_score DECIMAL(5,2),
    overall_score DECIMAL(5,2),

    notes TEXT,
    evaluated_by BIGINT NOT NULL,
    evaluated_at DATETIME NOT NULL,

    FOREIGN KEY (vendor_id)
        REFERENCES vendors(id),

    FOREIGN KEY (project_id)
        REFERENCES projects(id),

    FOREIGN KEY (evaluated_by)
        REFERENCES employees(id)
);
```

**TABLE: clients**
```sql
CREATE TABLE clients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    client_code VARCHAR(20) NOT NULL UNIQUE,
    company_name VARCHAR(255) NOT NULL,
    industry_id BIGINT NOT NULL,
    company_email VARCHAR(255) NOT NULL UNIQUE,
    company_number VARCHAR(20) NOT NULL,
    address TEXT,
    
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_industry_id FOREIGN KEY (industry_id) REFERENCES industries(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: client_contacts**
```sql
CREATE TABLE client_contacts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    client_id BIGINT NOT NULL,

    name VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    position VARCHAR(100),

    email VARCHAR(255),
    phone VARCHAR(20),
    whatsapp_number VARCHAR(20),

    is_primary BOOLEAN DEFAULT FALSE,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_client_contact_client
        FOREIGN KEY (client_id)
        REFERENCES clients(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: rfqs**
```sql
CREATE TABLE rfqs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    project_id BIGINT NOT NULL,

    rfq_number VARCHAR(50) NOT NULL UNIQUE,

    title VARCHAR(255) NOT NULL,

    description TEXT,

    created_by BIGINT NOT NULL,

    issue_date DATE NOT NULL,
    deadline DATE NOT NULL,

    status ENUM(
        'DRAFT',
        'OPEN',
        'CLOSED',
        'AWARDED',
        'CANCELLED'
    ) DEFAULT 'DRAFT',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (created_by) REFERENCES employees(id)
);
```

**TABLE: rfq_vendors**
```sql
CREATE TABLE rfq_vendors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    rfq_id BIGINT NOT NULL,
    vendor_id BIGINT NOT NULL,

    invited_at DATETIME,

    UNIQUE KEY uk_rfq_vendor (
        rfq_id,
        vendor_id
    ),

    FOREIGN KEY (rfq_id) REFERENCES rfqs(id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);
```

**TABLE: vendor_quotations**
```sql
CREATE TABLE vendor_quotations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    rfq_id BIGINT NOT NULL,

    vendor_id BIGINT NOT NULL,

    quotation_number VARCHAR(50),

    quotation_date DATE,

    amount DECIMAL(18,2) NOT NULL,

    lead_time_days INT,

    validity_until DATE,

    notes TEXT,

    status ENUM(
        'SUBMITTED',
        'SHORTLISTED',
        'SELECTED',
        'REJECTED'
    ) DEFAULT 'SUBMITTED',

    attachment_path TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (rfq_id) REFERENCES rfqs(id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);
```

**TABLE: client_rfqs**
```sql
CREATE TABLE client_rfqs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    rfq_number VARCHAR(50) NOT NULL UNIQUE,

    client_id BIGINT NOT NULL,

    rfq_date DATE NOT NULL,
    submission_deadline DATE NULL,

    title VARCHAR(255) NOT NULL,
    description TEXT,

    status ENUM(
        'DRAFT',
        'SUBMITTED',
        'UNDER_REVIEW',
        'QUOTED',
        'CLOSED',
        'CANCELLED'
    ) DEFAULT 'DRAFT',

    parent_id BIGINT NOT NULL DEFAULT NULL,

    created_by BIGINT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    is_active BOLEAN DEFAULT true

    FOREIGN KEY (client_id)
        REFERENCES clients(id)
        ON DELETE RESTRICT,

    FOREIGN KEY (created_by)
        REFERENCES employees(id)
        ON DELETE RESTRICT,

    FOREIGN KEY (parent_id)
        REFERENCES client_rfqs(id)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT

    INDEX idx_client_rfq_client (client_id),
    INDEX idx_client_rfq_project (project_id),
    INDEX idx_client_rfq_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: client_rfq_items**
```sql
CREATE TABLE client_rfq_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    client_rfq_id BIGINT NOT NULL,

    item_id BIGINT NULL,

    item_description VARCHAR(255) NOT NULL,
    specification TEXT,

    quantity DECIMAL(18,2) NOT NULL,
    unit VARCHAR(30) NOT NULL,

    requested_delivery_date DATE NULL,

    notes TEXT,

    FOREIGN KEY (client_rfq_id)
        REFERENCES client_rfqs(id)
        ON DELETE CASCADE,

    FOREIGN KEY (item_id)
        REFERENCES items(id)
        ON DELETE SET NULL,

    INDEX idx_client_rfq_item_rfq (client_rfq_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: client_quotations**
```sql
CREATE TABLE client_quotations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    quotation_number VARCHAR(50) NOT NULL UNIQUE,

    client_id BIGINT NOT NULL,
    client_rfq_id BIGINT NULL,
    project_id BIGINT NULL,

    quotation_date DATE NOT NULL,
    valid_until DATE NULL,

    title VARCHAR(255) NOT NULL,
    description TEXT,

    subtotal DECIMAL(18,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(18,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(18,2) NOT NULL DEFAULT 0,
    shipping_cost DECIMAL(18,2) NOT NULL DEFAULT 0,
    grand_total DECIMAL(18,2) NOT NULL DEFAULT 0,

    payment_terms TEXT,
    delivery_terms TEXT,
    warranty_terms TEXT,
    notes TEXT,

    status ENUM(
        'DRAFT',
        'SUBMITTED',
        'SENT',
        'NEGOTIATION',
        'ACCEPTED',
        'REJECTED',
        'EXPIRED',
        'CANCELLED'
    ) DEFAULT 'DRAFT',

    created_by BIGINT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (client_id)
        REFERENCES clients(id)
        ON DELETE RESTRICT,

    FOREIGN KEY (client_rfq_id)
        REFERENCES client_rfqs(id)
        ON DELETE SET NULL,

    FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE SET NULL,

    FOREIGN KEY (created_by)
        REFERENCES employees(id)
        ON DELETE RESTRICT,

    INDEX idx_client_quotation_client (client_id),
    INDEX idx_client_quotation_rfq (client_rfq_id),
    INDEX idx_client_quotation_project (project_id),
    INDEX idx_client_quotation_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: client_quotation_items**
```sql
CREATE TABLE client_quotation_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    quotation_id BIGINT NOT NULL,

    rfq_item_id BIGINT NULL,
    item_id BIGINT NULL,

    item_description VARCHAR(255) NOT NULL,
    specification TEXT,

    quantity DECIMAL(18,2) NOT NULL,
    unit VARCHAR(30) NOT NULL,

    unit_price DECIMAL(18,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(18,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(18,2) NOT NULL DEFAULT 0,

    total_price DECIMAL(18,2) NOT NULL DEFAULT 0,

    delivery_days INT NULL,

    notes TEXT,

    FOREIGN KEY (quotation_id)
        REFERENCES client_quotations(id)
        ON DELETE CASCADE,

    FOREIGN KEY (rfq_item_id)
        REFERENCES client_rfq_items(id)
        ON DELETE SET NULL,

    FOREIGN KEY (item_id)
        REFERENCES items(id)
        ON DELETE SET NULL,

    INDEX idx_client_quotation_item_quotation (quotation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: sales_orders**
```sql
CREATE TABLE sales_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    sales_order_number VARCHAR(50) NOT NULL UNIQUE,

    client_id BIGINT NOT NULL,

    quotation_id BIGINT NULL,
    project_id BIGINT NULL,

    customer_po_number VARCHAR(100) NULL,
    customer_po_date DATE NULL,

    order_type ENUM(
        'GOODS',
        'SERVICE',
        'PROJECT',
        'MIXED'
    ) NOT NULL DEFAULT 'GOODS',

    order_date DATE NOT NULL,

    start_date DATE NULL,
    expected_completion_date DATE NULL,

    subtotal DECIMAL(18,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(18,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(18,2) NOT NULL DEFAULT 0,
    shipping_cost DECIMAL(18,2) NOT NULL DEFAULT 0,
    grand_total DECIMAL(18,2) NOT NULL DEFAULT 0,

    payment_terms TEXT,
    delivery_terms TEXT,
    notes TEXT,

    status ENUM(
        'DRAFT',
        'CONFIRMED',
        'IN_PROGRESS',
        'PARTIALLY_DELIVERED',
        'DELIVERED',
        'COMPLETED',
        'CANCELLED'
    ) DEFAULT 'DRAFT',

    created_by BIGINT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (client_id)
        REFERENCES clients(id)
        ON DELETE RESTRICT,

    FOREIGN KEY (quotation_id)
        REFERENCES client_quotations(id)
        ON DELETE SET NULL,

    FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE SET NULL,

    FOREIGN KEY (created_by)
        REFERENCES employees(id)
        ON DELETE RESTRICT,

    INDEX idx_sales_order_client (client_id),
    INDEX idx_sales_order_project (project_id),
    INDEX idx_sales_order_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: sales_order_items**
```sql
CREATE TABLE sales_order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    sales_order_id BIGINT NOT NULL,

    quotation_item_id BIGINT NULL,
    item_id BIGINT NULL,

    item_description VARCHAR(255) NOT NULL,
    specification TEXT,

    quantity DECIMAL(18,2) NOT NULL,
    unit VARCHAR(30) NOT NULL,

    unit_price DECIMAL(18,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(18,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(18,2) NOT NULL DEFAULT 0,

    total_price DECIMAL(18,2) NOT NULL DEFAULT 0,

    delivered_quantity DECIMAL(18,2) NOT NULL DEFAULT 0,
    invoiced_quantity DECIMAL(18,2) NOT NULL DEFAULT 0,

    notes TEXT,

    FOREIGN KEY (sales_order_id)
        REFERENCES sales_orders(id)
        ON DELETE CASCADE,

    FOREIGN KEY (quotation_item_id)
        REFERENCES client_quotation_items(id)
        ON DELETE SET NULL,

    FOREIGN KEY (item_id)
        REFERENCES items(id)
        ON DELETE SET NULL,

    INDEX idx_sales_order_item_order (sales_order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: sales_order_documents**
```sql
CREATE TABLE sales_order_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    sales_order_id BIGINT NOT NULL,

    document_type ENUM(
        'CUSTOMER_PO',
        'SPK',
        'CONTRACT',
        'OTHER'
    ) NOT NULL,

    document_number VARCHAR(100) NULL,
    document_date DATE NULL,

    file_name VARCHAR(255) NULL,
    file_path TEXT NULL,

    notes TEXT,

    uploaded_by BIGINT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (sales_order_id)
        REFERENCES sales_orders(id)
        ON DELETE CASCADE,

    FOREIGN KEY (uploaded_by)
        REFERENCES employees(id)
        ON DELETE RESTRICT,

    INDEX idx_sales_order_document_order (sales_order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: delivery_orders**
```sql
CREATE TABLE delivery_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    delivery_number VARCHAR(50) NOT NULL UNIQUE,

    sales_order_id BIGINT NOT NULL,
    project_id BIGINT NULL,
    client_id BIGINT NOT NULL,

    delivery_date DATE NOT NULL,

    delivery_address TEXT,

    driver_name VARCHAR(100) NULL,
    vehicle_number VARCHAR(50) NULL,

    received_by_name VARCHAR(100) NULL,
    received_by_position VARCHAR(100) NULL,

    notes TEXT,

    status ENUM(
        'DRAFT',
        'READY',
        'IN_TRANSIT',
        'DELIVERED',
        'CANCELLED'
    ) DEFAULT 'DRAFT',

    created_by BIGINT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (sales_order_id)
        REFERENCES sales_orders(id)
        ON DELETE RESTRICT,

    FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE SET NULL,

    FOREIGN KEY (client_id)
        REFERENCES clients(id)
        ON DELETE RESTRICT,

    FOREIGN KEY (created_by)
        REFERENCES employees(id)
        ON DELETE RESTRICT,

    INDEX idx_do_sales_order (sales_order_id),
    INDEX idx_do_client (client_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: delivery_order_items**
```sql
CREATE TABLE delivery_order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    delivery_order_id BIGINT NOT NULL,

    sales_order_item_id BIGINT NOT NULL,
    item_id BIGINT NULL,

    quantity DECIMAL(18,2) NOT NULL,
    unit VARCHAR(30) NOT NULL,

    notes TEXT,

    FOREIGN KEY (delivery_order_id)
        REFERENCES delivery_orders(id)
        ON DELETE CASCADE,

    FOREIGN KEY (sales_order_item_id)
        REFERENCES sales_order_items(id)
        ON DELETE RESTRICT,

    FOREIGN KEY (item_id)
        REFERENCES items(id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: BAST**
```sql
CREATE TABLE basts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    bast_number VARCHAR(50) NOT NULL UNIQUE,

    sales_order_id BIGINT NOT NULL,
    project_id BIGINT NULL,
    client_id BIGINT NOT NULL,

    delivery_order_id BIGINT NULL,

    bast_date DATE NOT NULL,

    bast_type ENUM(
        'GOODS',
        'SERVICE',
        'PROJECT',
        'FINAL'
    ) NOT NULL,

    title VARCHAR(255) NOT NULL,
    description TEXT,

    status ENUM(
        'DRAFT',
        'SUBMITTED',
        'SIGNED',
        'REJECTED',
        'CANCELLED'
    ) DEFAULT 'DRAFT',

    prepared_by BIGINT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (sales_order_id)
        REFERENCES sales_orders(id)
        ON DELETE RESTRICT,

    FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE SET NULL,

    FOREIGN KEY (client_id)
        REFERENCES clients(id)
        ON DELETE RESTRICT,

    FOREIGN KEY (delivery_order_id)
        REFERENCES delivery_orders(id)
        ON DELETE SET NULL,

    FOREIGN KEY (prepared_by)
        REFERENCES employees(id)
        ON DELETE RESTRICT,

    INDEX idx_bast_sales_order (sales_order_id),
    INDEX idx_bast_project (project_id),
    INDEX idx_bast_client (client_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: bast_items**
```sql
CREATE TABLE bast_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    bast_id BIGINT NOT NULL,

    sales_order_item_id BIGINT NULL,
    item_id BIGINT NULL,

    description VARCHAR(255) NOT NULL,

    quantity DECIMAL(18,2) NOT NULL,
    unit VARCHAR(30) NOT NULL,

    condition_status ENUM(
        'GOOD',
        'ACCEPTED',
        'WITH_NOTE',
        'REJECTED'
    ) DEFAULT 'ACCEPTED',

    notes TEXT,

    FOREIGN KEY (bast_id)
        REFERENCES basts(id)
        ON DELETE CASCADE,

    FOREIGN KEY (sales_order_item_id)
        REFERENCES sales_order_items(id)
        ON DELETE SET NULL,

    FOREIGN KEY (item_id)
        REFERENCES items(id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: customer_payments**
```sql
CREATE TABLE customer_payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    payment_number VARCHAR(50) NOT NULL UNIQUE,

    client_id BIGINT NOT NULL,

    payment_date DATE NOT NULL,

    payment_method ENUM(
        'BANK_TRANSFER',
        'CASH',
        'GIRO',
        'CHEQUE',
        'OTHER'
    ) NOT NULL,

    bank_account VARCHAR(100) NULL,
    reference_number VARCHAR(100) NULL,

    amount DECIMAL(18,2) NOT NULL,

    notes TEXT,

    status ENUM(
        'PENDING',
        'CONFIRMED',
        'CANCELLED'
    ) DEFAULT 'PENDING',

    received_by BIGINT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (client_id)
        REFERENCES clients(id)
        ON DELETE RESTRICT,

    FOREIGN KEY (received_by)
        REFERENCES employees(id)
        ON DELETE RESTRICT,

    INDEX idx_customer_payment_client (client_id),
    INDEX idx_customer_payment_date (payment_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: customer_payment_allocations**
```sql
CREATE TABLE customer_payment_allocations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    payment_id BIGINT NOT NULL,
    invoice_id BIGINT NOT NULL,

    allocated_amount DECIMAL(18,2) NOT NULL,

    FOREIGN KEY (payment_id)
        REFERENCES customer_payments(id)
        ON DELETE CASCADE,

    FOREIGN KEY (invoice_id)
        REFERENCES invoices(id)
        ON DELETE RESTRICT,

    UNIQUE KEY uk_payment_invoice (
        payment_id,
        invoice_id
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Project
**TABLE: project_statuses**
```sql
CREATE TABLE project_statuses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(100) NOT NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: projects**
```sql
CREATE TABLE projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_code VARCHAR(50) NOT NULL UNIQUE,
    project_name VARCHAR(200) NOT NULL,
    client_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    contract_value DECIMAL(18, 2) NOT NULL,
    status_id BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_client_id FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE RESTRICT,
    CONSTRAINT fk_project_status FOREIGN KEY (status_id) REFERENCES project_statuses (id) ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: project_contracts**
```sql
CREATE TABLE project_contracts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    project_id BIGINT NOT NULL,

    contract_number VARCHAR(100) NOT NULL,

    contract_type ENUM(
        'ORIGINAL',
        'AMENDMENT',
        'EXTENSION',
        'CHANGE_ORDER'
    ) DEFAULT 'ORIGINAL',

    contract_date DATE NOT NULL,

    start_date DATE,
    end_date DATE,

    contract_value DECIMAL(18,2) NOT NULL,

    status ENUM(
        'DRAFT',
        'SUBMITTED',
        'APPROVED',
        'ACTIVE',
        'CLOSED',
        'CANCELLED'
    ) DEFAULT 'DRAFT',

    parent_contract_id BIGINT NULL,

    created_by BIGINT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(project_id)
        REFERENCES projects(id),

    FOREIGN KEY(parent_contract_id)
        REFERENCES project_contracts(id),

    FOREIGN KEY(created_by)
        REFERENCES employees(id)
);
```

**TABLE: project_documents**
```sql
CREATE TABLE project_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    project_id BIGINT NOT NULL,

    document_type ENUM(
        'CONTRACT',
        'PO',
        'BAST',
        'DRAWING',
        'INVOICE',
        'PHOTO',
        'OTHER'
    ),

    file_name VARCHAR(255),

    file_path TEXT NOT NULL,

    version_no INT DEFAULT 1,

    uploaded_by BIGINT NOT NULL,

    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id)
        REFERENCES projects(id),

    FOREIGN KEY (uploaded_by)
        REFERENCES employees(id)
);
```

**TABLE: project_budgets**
```sql
CREATE TABLE project_budgets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    project_id BIGINT NOT NULL,

    budget_category ENUM(
        'MATERIAL',
        'LABOR',
        'VENDOR',
        'TRANSPORT',
        'OPERATIONAL',
        'OTHER'
    ) NOT NULL,

    planned_amount DECIMAL(18,2) NOT NULL DEFAULT 0,
    actual_amount DECIMAL(18,2) NOT NULL DEFAULT 0,

    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id) REFERENCES projects(id)
);
```

**TABLE: project_tasks**
```sql
CREATE TABLE project_tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    project_id BIGINT NOT NULL,

    parent_task_id BIGINT NULL,

    task_name VARCHAR(255) NOT NULL,

    description TEXT,

    assigned_to BIGINT NULL,

    priority ENUM(
        'LOW',
        'MEDIUM',
        'HIGH',
        'CRITICAL'
    ) DEFAULT 'MEDIUM',

    progress DECIMAL(5,2) DEFAULT 0,

    start_date DATE,
    due_date DATE,

    status ENUM(
        'OPEN',
        'IN_PROGRESS',
        'REVIEW',
        'DONE',
        'CANCELLED'
    ) DEFAULT 'OPEN',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (parent_task_id) REFERENCES project_tasks(id),
    FOREIGN KEY (assigned_to) REFERENCES employees(id)
);
```

**TABLE: project_milestones**
```sql
CREATE TABLE project_milestones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    project_id BIGINT NOT NULL,

    milestone_name VARCHAR(255) NOT NULL,

    target_date DATE NOT NULL,

    actual_date DATE NULL,

    progress DECIMAL(5,2) DEFAULT 0,

    status ENUM(
        'PENDING',
        'ONGOING',
        'COMPLETED',
        'DELAYED'
    ) DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id) REFERENCES projects(id)
);
```

**TABLE: approvals**
```sql
CREATE TABLE approvals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    reference_type VARCHAR(50) NOT NULL,

    reference_id BIGINT NOT NULL,

    approver_id BIGINT NOT NULL,

    approval_level INT DEFAULT 1,

    status ENUM(
        'PENDING',
        'APPROVED',
        'REJECTED'
    ) DEFAULT 'PENDING',

    approved_at DATETIME NULL,

    notes TEXT,

    FOREIGN KEY (approver_id)
        REFERENCES employees(id)
);
```

**TABLE: project_risks**
```sql
CREATE TABLE project_risks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    project_id BIGINT NOT NULL,

    risk_name VARCHAR(255) NOT NULL,

    description TEXT,

    probability ENUM(
        'LOW',
        'MEDIUM',
        'HIGH'
    ),

    impact ENUM(
        'LOW',
        'MEDIUM',
        'HIGH'
    ),

    mitigation_plan TEXT,

    owner_id BIGINT,

    status ENUM(
        'OPEN',
        'MITIGATED',
        'CLOSED'
    ) DEFAULT 'OPEN',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id)
        REFERENCES projects(id),

    FOREIGN KEY (owner_id)
        REFERENCES employees(id)
);
```

**TABLE: project_change_requests**
```sql
CREATE TABLE project_change_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    project_id BIGINT NOT NULL,

    request_number VARCHAR(50) UNIQUE,

    request_type ENUM(
        'SCOPE',
        'BUDGET',
        'TIMELINE',
        'RESOURCE'
    ),

    old_value TEXT,
    new_value TEXT,

    reason TEXT,

    requested_by BIGINT NOT NULL,

    status ENUM(
        'PENDING',
        'APPROVED',
        'REJECTED'
    ) DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id)
        REFERENCES projects(id),

    FOREIGN KEY (requested_by)
        REFERENCES employees(id)
);
```

**TABLE: project_costs**
```sql
CREATE TABLE project_costs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    project_id BIGINT NOT NULL,

    source_type ENUM(
        'PO',
        'VENDOR_BILL',
        'PAYROLL',
        'EXPENSE'
    ),

    source_id BIGINT NOT NULL,

    cost_category VARCHAR(100),

    amount DECIMAL(18,2) NOT NULL,

    transaction_date DATE NOT NULL,

    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id)
        REFERENCES projects(id)
);
```

**TABLE: teams**
```sql
CREATE TABLE teams (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    team_code VARCHAR(20) NOT NULL UNIQUE,
    team_name VARCHAR(100) NOT NULL,

    team_leader_id BIGINT NULL,

    description TEXT,

    status ENUM(
        'ACTIVE',
        'INACTIVE'
    ) DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_team_leader
        FOREIGN KEY (team_leader_id)
        REFERENCES employees(id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: team_members**
```sql
CREATE TABLE team_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    team_id BIGINT NOT NULL,
    employee_id BIGINT NOT NULL,

    role_in_team VARCHAR(50),

    join_date DATE,
    leave_date DATE NULL,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uk_team_employee (
        team_id,
        employee_id
    ),

    CONSTRAINT fk_tm_team
        FOREIGN KEY (team_id)
        REFERENCES teams(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_tm_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**TABLE: project_teams**
```sql
CREATE TABLE project_teams (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    project_id BIGINT NOT NULL,
    team_id BIGINT NOT NULL,

    assigned_date DATE NOT NULL,
    released_date DATE NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uk_project_team (
        project_id,
        team_id
    ),

    CONSTRAINT fk_pt_project
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_pt_team
        FOREIGN KEY (team_id)
        REFERENCES teams(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```