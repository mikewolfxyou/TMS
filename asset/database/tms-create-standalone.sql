CREATE sequence tms_task_seq start with 1;
CREATE table tms_task (
	task_id integer
			constraint tms_task_pk
			primary key,
    job_id  uuid
            constraint tms_task_job_id
            not null,
	email	varchar(100)
			constraint tms_task_email
			not null,
	source	varchar(100)
			constraint tms_task_source
			not null,
    target	varchar(100)
			constraint tms_task_target
			not null,
	original_file_name	varchar(3000)
			constraint tms_task_original_file_name
			not null,
    original_file_path	varchar(3000)
			constraint tms_task_original_file_path
			not null,
    translated_file_name  varchar(3000)
			constraint tms_task_translated_file_name
			null,
    translated_file_path  varchar(3000)
			constraint tms_task_translated_file_path
			null,
    task_status  integer
			constraint tms_task_task_status
			null
);

CREATE TABLE tms_email_service (
    job_id  uuid
            constraint tms_email_service_job_id
            primary key,
    email	varchar(100)
			constraint tms_email_service_email
			not null,
    email_status integer
			constraint tms_email_email_status
			null
);
