# Agent Configuration: todo-executor

## Startup
- goal: Manage the persistence of the To-Do list.
- tools: [ "read_file", "write_to_file", "run_command" ]

## Cron
- schedule: "0 * * * *" # Hourly cleanup/backup if needed
