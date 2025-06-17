-- Add process_days column to all document tables
ALTER TABLE base_documents ADD COLUMN process_days INT COMMENT 'Number of days to process the document';

-- Add process_days column to all specific document tables
ALTER TABLE pcab_documents ADD COLUMN process_days INT COMMENT 'Number of days to process the document';
ALTER TABLE iso_certifying_body_documents ADD COLUMN process_days INT COMMENT 'Number of days to process the document';
ALTER TABLE dti_sec_cda_documents ADD COLUMN process_days INT COMMENT 'Number of days to process the document';
ALTER TABLE bir_documents ADD COLUMN process_days INT COMMENT 'Number of days to process the document';
ALTER TABLE lgu_documents ADD COLUMN process_days INT COMMENT 'Number of days to process the document';
ALTER TABLE sec_documents ADD COLUMN process_days INT COMMENT 'Number of days to process the document';
ALTER TABLE sss_documents ADD COLUMN process_days INT COMMENT 'Number of days to process the document';
ALTER TABLE philhealth_documents ADD COLUMN process_days INT COMMENT 'Number of days to process the document';
ALTER TABLE pag_ibig_fund_documents ADD COLUMN process_days INT COMMENT 'Number of days to process the document';
ALTER TABLE dole_accredited_training_centers_documents ADD COLUMN process_days INT COMMENT 'Number of days to process the document';
ALTER TABLE nbi_documents ADD COLUMN process_days INT COMMENT 'Number of days to process the document';
ALTER TABLE bir_accredited_cpa_documents ADD COLUMN process_days INT COMMENT 'Number of days to process the document';
ALTER TABLE company_appraiser_banks_documents ADD COLUMN process_days INT COMMENT 'Number of days to process the document';
ALTER TABLE bank_documents ADD COLUMN process_days INT COMMENT 'Number of days to process the document';
ALTER TABLE prc_documents ADD COLUMN process_days INT COMMENT 'Number of days to process the document';
ALTER TABLE dole_accredited_trainers_documents ADD COLUMN process_days INT COMMENT 'Number of days to process the document';
ALTER TABLE company_lto_suppliers_documents ADD COLUMN process_days INT COMMENT 'Number of days to process the document'; 