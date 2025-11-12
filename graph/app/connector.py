
#Xabi Alonso,26,Spain,Liverpool,2004,2008,143,Premier League
#Michael Owen,23,England,Liverpool,1996,2003,216,Premier League
#Michael Owen,31,England,Man Utd,2009,2011,31,Premier League
#Roy Keane,33,Ireland,Man Utd,1993,2005,326,Premier League
import itertools
import networkx as nx
import pandas as pd
import glob
import os


# Adjust the path and pattern to match CSV filenames
data_path = os.path.join(os.path.dirname(os.getcwd()), "datasets")
print(data_path)
csv_files = glob.glob(os.path.join(data_path, "*_cumulative.csv"))

if not csv_files:
    raise FileNotFoundError(f"No CSV files found in {data_path}")
print(f"Found {len(csv_files)} CSV files:")
# Read and concatenate all CSVs
df_list = [pd.read_csv(file) for file in csv_files]
combined_df = pd.concat(df_list, ignore_index=True)

# Optional: remove duplicates just in case
combined_df = combined_df.drop_duplicates(subset=["player_id","player_name", "team_name", "start_year", "end_year"])

# Save the combined dataset with unique player IDs
combined_csv_path = os.path.join(data_path, "all_leagues_combined.csv")
combined_df.to_csv(combined_csv_path, index=False)
print(f"Saved combined CSV with unique player IDs to {combined_csv_path}")


