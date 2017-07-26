TYPE=TRIGGERS
triggers='CREATE DEFINER=`CleoUser`@`localhost` TRIGGER Catch_Alarm_Event AFTER UPDATE ON Alarm_Items FOR EACH ROW INSERT INTO Event_Log SET Type = "Alarm", Event = concat("{""Zone"":""",New.Description,""",""Current_State"":""",New.Current_State,"""}"),Time = NOW()'
sql_modes=8
definers='CleoUser@localhost'
client_cs_names='utf8'
connection_cl_names='utf8_general_ci'
db_cl_names='latin1_swedish_ci'
