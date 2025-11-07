import pandas as pd
import os

# Define leagues and filenames
leagues = [
    "premier_league", "bundesliga", "bundesliga_2", "championship", "eredivise",
    "jupiler_pro_league", "la_liga", "la_liga_2", "liga_portugal", "ligue_1",
    "ligue_2", "scottish_premiership", "serie_a", "serie_b", "super_lig"
]

start_season = 2025  # match your scraper naming

for league in leagues:
    filename = f"{league}_{start_season}_cumulative.csv"
    if not os.path.exists(filename):
        print(f"⚠️ File not found: {filename}")
        continue

    print(f"🧹 Cleaning {filename}...")
    df = pd.read_csv(filename)

    # Drop exact duplicates
    before = len(df)
    df = df.drop_duplicates()
    after = len(df)

    # Optionally, also drop duplicates ignoring appearances (if you just want unique player-team-year)
    # df = df.drop_duplicates(subset=["player_name", "team_name", "start_year", "end_year"])

    df.to_csv(filename, index=False)
    print(f"✅ Cleaned {filename}: removed {before - after} duplicates, kept {after}")

print("✨ All CSVs cleaned successfully!")