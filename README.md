# EKERP
Enterprise Resource Planning


# PREPARATION
## Create Database

### HRIS

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

**TABLE: category**
```sql
CREATE TABLE category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category_code VARCHAR(50) NOT NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
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
    pr_id BIGINT NULL, -- Bisa NULL jika PO dibuat langsung tanpa PR
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
    CONSTRAINT fk_po_pr FOREIGN KEY (pr_id) REFERENCES purchase_requests(id) ON DELETE SET NULL,
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
    
    received_quantity INT DEFAULT 0, -- Untuk tracking saat barang tiba di gudang
    
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

**TABLE: clients**
```sql
CREATE TABLE clients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    client_code VARCHAR(20) NOT NULL UNIQUE,
    company_name VARCHAR(255) NOT NULL,
    industry_id BIGINT NOT NULL,
    pic_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telephone_number VARCHAR(20) NOT NULL,
    address TEXT,
    
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_industry_id FOREIGN KEY (industry_id) REFERENCES industries(id) ON DELETE RESTRICT
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

    created_by BIGINT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (client_id)
        REFERENCES clients(id)
        ON DELETE RESTRICT,

    FOREIGN KEY (created_by)
        REFERENCES employees(id)
        ON DELETE RESTRICT,

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