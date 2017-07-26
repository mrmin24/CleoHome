TYPE=TRIGGERS
triggers='CREATE DEFINER=`CleoUser`@`localhost` TRIGGER Catch_Motion_Event AFTER UPDATE ON Items  FOR EACH ROW  \nbegin\nIF NEW.Item_Type = 7 THEN\nINSERT INTO Event_Log SET Type = "Motion", Event = concat("{""Zone"":""",New.Item_Name,""",""Current_State"":""",New.Item_Current_Value,"""}"),Time = NOW(); END IF; END'
sql_modes=0
definers='CleoUser@localhost'
client_cs_names='utf8'
connection_cl_names='utf8_general_ci'
db_cl_names='latin1_swedish_ci'
