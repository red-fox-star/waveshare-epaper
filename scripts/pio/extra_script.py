import os
Import("env")

# make pio emit the compile_commands to the project root instead of deeply nested in the pio folder
env.Replace(COMPILATIONDB_PATH=os.path.join("$PROJECT_DIR", "compile_commands.json"))
