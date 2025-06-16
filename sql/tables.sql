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
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
); 