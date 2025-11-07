import pandas as pd
import os
# Point directly to graph/datasets
data_path = os.path.join(os.getcwd(), "datasets")
combined_csv_path = os.path.join(data_path, "all_leagues_combined.csv")

print("Looking for file at:", combined_csv_path)

# Load the CSV
df = pd.read_csv(combined_csv_path)

# Count unique players
unique_players = df["player_name"].nunique()
print("Number of unique players:", unique_players)