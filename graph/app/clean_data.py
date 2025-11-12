import pandas as pd
import os

# Load your main dataset
data_path = os.path.join(os.path.dirname(__file__), "..", "datasets")
data_path = os.path.abspath(data_path)
players_path = os.path.join(data_path, "all_leagues_combined.csv")
logos_path = os.path.join(data_path, "team_logos_combined.csv")

df = pd.read_csv(players_path)
logos = pd.read_csv(logos_path)

# Merge team logos into player dataset by team_name
df = df.merge(logos, on="team_name", how="left")

# Save updated dataset
merged_path = os.path.join(data_path, "all_leagues_with_logos.csv")
df.to_csv(merged_path, index=False)
print(f"✅ Merged dataset with team logos saved to {merged_path}")