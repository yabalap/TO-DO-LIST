-- Base table structure for all document types
CREATE TABLE base_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(100) NOT NULL COMMENT 'Document type/category',
    department VARCHAR(100) NOT NULL COMMENT 'Department responsible',
    description TEXT COMMENT 'Main description of the document',
    special_description VARCHAR(255) COMMENT 'Additional special description',
    person_accountable VARCHAR(100) NOT NULL COMMENT 'Person responsible for the document',
    renewal_frequency VARCHAR(50) COMMENT 'How often the document needs renewal',
    status VARCHAR(50) NOT NULL DEFAULT 'Active' COMMENT 'Current status of the document',
    link_proof VARCHAR(255) COMMENT 'Link to proof/document file',
    validity_date DATE COMMENT 'Date when document becomes valid',
    due_date DATE COMMENT 'Date when document is due for renewal',
    expiration_date DATE COMMENT 'Date when document expires',
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'When the document was uploaded',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'When the document was last updated',
    INDEX idx_type (type),
    INDEX idx_department (department),
    INDEX idx_status (status),
    INDEX idx_expiration_date (expiration_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create specific document tables inheriting from base_documents
CREATE TABLE pcab_documents LIKE base_documents;
CREATE TABLE iso_certifying_body_documents LIKE base_documents;
CREATE TABLE dti_sec_cda_documents LIKE base_documents;
CREATE TABLE bir_documents LIKE base_documents;
CREATE TABLE lgu_documents LIKE base_documents;
CREATE TABLE sec_documents LIKE base_documents;
CREATE TABLE sss_documents LIKE base_documents;
CREATE TABLE philhealth_documents LIKE base_documents;
CREATE TABLE pag_ibig_fund_documents LIKE base_documents;
CREATE TABLE dole_accredited_training_centers_documents LIKE base_documents;
CREATE TABLE nbi_documents LIKE base_documents;
CREATE TABLE bir_accredited_cpa_documents LIKE base_documents;
CREATE TABLE company_appraiser_banks_documents LIKE base_documents;
CREATE TABLE bank_documents LIKE base_documents;
CREATE TABLE prc_documents LIKE base_documents;
CREATE TABLE dole_accredited_trainers_documents LIKE base_documents;
CREATE TABLE company_lto_suppliers_documents LIKE base_documents;

-- Add table-specific comments
ALTER TABLE pcab_documents COMMENT 'PCAB (Philippine Contractors Accreditation Board) Documents';
ALTER TABLE iso_certifying_body_documents COMMENT 'ISO Certifying Body Documents';
ALTER TABLE dti_sec_cda_documents COMMENT 'DTI/SEC/CDA Documents';
ALTER TABLE bir_documents COMMENT 'BIR (Bureau of Internal Revenue) Documents';
ALTER TABLE lgu_documents COMMENT 'Local Government Unit Documents';
ALTER TABLE sec_documents COMMENT 'Securities and Exchange Commission Documents';
ALTER TABLE sss_documents COMMENT 'Social Security System Documents';
ALTER TABLE philhealth_documents COMMENT 'PhilHealth Documents';
ALTER TABLE pag_ibig_fund_documents COMMENT 'Pag-IBIG Fund Documents';
ALTER TABLE dole_accredited_training_centers_documents COMMENT 'DOLE Accredited Training Centers Documents';
ALTER TABLE nbi_documents COMMENT 'National Bureau of Investigation Documents';
ALTER TABLE bir_accredited_cpa_documents COMMENT 'BIR Accredited CPA Documents';
ALTER TABLE company_appraiser_banks_documents COMMENT 'Company Appraiser Banks Documents';
ALTER TABLE bank_documents COMMENT 'Bank Documents';
ALTER TABLE prc_documents COMMENT 'Professional Regulation Commission Documents';
ALTER TABLE dole_accredited_trainers_documents COMMENT 'DOLE Accredited Trainers Documents';
ALTER TABLE company_lto_suppliers_documents COMMENT 'Company LTO Suppliers Documents';

-- Create tables for each document type
CREATE TABLE pcab_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255),
    department VARCHAR(255),
    description TEXT,
    person_accountable VARCHAR(255),
    renewal_frequency VARCHAR(255),
    status VARCHAR(255),
    link_proof VARCHAR(255),
    validity_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    due_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    expiration_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    special_description VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE iso_certifying_body_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255),
    department VARCHAR(255),
    description TEXT,
    person_accountable VARCHAR(255),
    renewal_frequency VARCHAR(255),
    status VARCHAR(255),
    link_proof VARCHAR(255),
    validity_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    due_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    expiration_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    special_description VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE dti_sec_cda_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255),
    department VARCHAR(255),
    description TEXT,
    person_accountable VARCHAR(255),
    renewal_frequency VARCHAR(255),
    status VARCHAR(255),
    link_proof VARCHAR(255),
    validity_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    due_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    expiration_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    special_description VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE bir_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255),
    department VARCHAR(255),
    description TEXT,
    person_accountable VARCHAR(255),
    renewal_frequency VARCHAR(255),
    status VARCHAR(255),
    link_proof VARCHAR(255),
    validity_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    due_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    expiration_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    special_description VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE lgu_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255),
    department VARCHAR(255),
    description TEXT,
    person_accountable VARCHAR(255),
    renewal_frequency VARCHAR(255),
    status VARCHAR(255),
    link_proof VARCHAR(255),
    validity_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    due_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    expiration_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    special_description VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE sec_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255),
    department VARCHAR(255),
    description TEXT,
    person_accountable VARCHAR(255),
    renewal_frequency VARCHAR(255),
    status VARCHAR(255),
    link_proof VARCHAR(255),
    validity_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    due_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    expiration_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    special_description VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE sss_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255),
    department VARCHAR(255),
    description TEXT,
    person_accountable VARCHAR(255),
    renewal_frequency VARCHAR(255),
    status VARCHAR(255),
    link_proof VARCHAR(255),
    validity_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    due_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    expiration_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    special_description VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE philhealth_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255),
    department VARCHAR(255),
    description TEXT,
    person_accountable VARCHAR(255),
    renewal_frequency VARCHAR(255),
    status VARCHAR(255),
    link_proof VARCHAR(255),
    validity_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    due_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    expiration_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    special_description VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE pag_ibig_fund_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255),
    department VARCHAR(255),
    description TEXT,
    person_accountable VARCHAR(255),
    renewal_frequency VARCHAR(255),
    status VARCHAR(255),
    link_proof VARCHAR(255),
    validity_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    due_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    expiration_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    special_description VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE dole_accredited_training_centers_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255),
    department VARCHAR(255),
    description TEXT,
    person_accountable VARCHAR(255),
    renewal_frequency VARCHAR(255),
    status VARCHAR(255),
    link_proof VARCHAR(255),
    validity_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    due_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    expiration_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    special_description VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE nbi_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255),
    department VARCHAR(255),
    description TEXT,
    person_accountable VARCHAR(255),
    renewal_frequency VARCHAR(255),
    status VARCHAR(255),
    link_proof VARCHAR(255),
    validity_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    due_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    expiration_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    special_description VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE bir_accredited_cpa_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255),
    department VARCHAR(255),
    description TEXT,
    person_accountable VARCHAR(255),
    renewal_frequency VARCHAR(255),
    status VARCHAR(255),
    link_proof VARCHAR(255),
    validity_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    due_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    expiration_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    special_description VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE company_appraiser_banks_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255),
    department VARCHAR(255),
    description TEXT,
    person_accountable VARCHAR(255),
    renewal_frequency VARCHAR(255),
    status VARCHAR(255),
    link_proof VARCHAR(255),
    validity_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    due_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    expiration_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    special_description VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE bank_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255),
    department VARCHAR(255),
    description TEXT,
    person_accountable VARCHAR(255),
    renewal_frequency VARCHAR(255),
    status VARCHAR(255),
    link_proof VARCHAR(255),
    validity_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    due_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    expiration_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    special_description VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE prc_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255),
    department VARCHAR(255),
    description TEXT,
    person_accountable VARCHAR(255),
    renewal_frequency VARCHAR(255),
    status VARCHAR(255),
    link_proof VARCHAR(255),
    validity_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    due_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    expiration_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    special_description VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE dole_accredited_trainers_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255),
    department VARCHAR(255),
    description TEXT,
    person_accountable VARCHAR(255),
    renewal_frequency VARCHAR(255),
    status VARCHAR(255),
    link_proof VARCHAR(255),
    validity_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    due_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    expiration_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    special_description VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE company_lto_suppliers_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255),
    department VARCHAR(255),
    description TEXT,
    person_accountable VARCHAR(255),
    renewal_frequency VARCHAR(255),
    status VARCHAR(255),
    link_proof VARCHAR(255),
    validity_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    due_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    expiration_date VARCHAR(10) COMMENT 'Format: MM-DD-YYYY',
    special_description VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
); 