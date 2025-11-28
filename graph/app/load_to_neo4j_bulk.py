# load_to_neo4j.py
from py2neo import Graph, Node, Relationship
import pandas as pd
import os
import itertools

# Neo4j connection
uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
user = os.getenv("NEO4J_USER", "neo4j")
password = os.getenv("NEO4J_PASS", "password")

graph = Graph(uri, auth=(user, password))

print("Ensuring indexes exist for Player and Team...")

graph.run("""
CREATE INDEX player_id_index IF NOT EXISTS FOR (p:Player) ON (p.player_id)
""")

graph.run("""
CREATE INDEX team_name_index IF NOT EXISTS FOR (t:Team) ON (t.name)
""")


print("Clearing Neo4j database in batches...")

batch_size = 50000
while True:
    result = graph.run(f"""
        MATCH (n)
        WITH n LIMIT {batch_size}
        DETACH DELETE n
        RETURN count(n) as deleted
    """).data()
    
    deleted = result[0]["deleted"] if result else 0
    print(f"Deleted {deleted} nodes...")
    if deleted == 0:
        break

print("✅ Database cleared successfully.")

# Load the big CSV
csv_path = os.path.join(os.getcwd(), "datasets", "all_leagues_with_logos.csv")
df = pd.read_csv(csv_path)
print(f"Loaded {len(df)} records from {csv_path}")

# Clean up data
df = df.drop_duplicates(subset=["player_id", "team_name", "start_year", "end_year"])
df["age"] = df["age"].apply(lambda x: int(x) if pd.notna(x) else None)

# --- 1️⃣ Create Player and Team Nodes with PLAYED_FOR relationships ---
print("Creating Player and Team nodes with PLAYED_FOR relationships...")

batch_size = 1000
tx = graph.begin()

for i, row in enumerate(df.itertuples(), 1):
    player = Node("Player", 
                  player_id=row.player_id,
                  name=row.player_name, 
                  age=row.age if not pd.isna(row.age) else None, 
                  nationality=row.nationality,
                  image_url=getattr(row, "image_url", None))
    
    team = Node("Team", 
                name=row.team_name, 
                logo_url=getattr(row, "logo_url", None))

    tx.merge(player, "Player", "player_id")
    tx.merge(team, "Team", "name")

    rel = Relationship(
        player, "PLAYED_FOR", team,
        start_year=int(row.start_year),
        end_year=int(row.end_year),
        league=row.league_name
    )
    tx.merge(rel)

    # Commit every 1000 rows
    if i % batch_size == 0:
        tx.commit()
        print(f"Committed {i} rows...")
        tx = graph.begin()

# Final commit
tx.commit()
print("Finished creating PLAYED_FOR relationships.")

# --- 2️⃣ Build teammate pairs in bulk ---
print("Building teammate pairs for bulk import...")

def overlap_years(s1, e1, s2, e2):
    """Return overlapping year range as (start, end) or None if no overlap."""
    overlap_start = max(s1, s2)
    overlap_end = min(e1, e2)
    if overlap_start <= overlap_end:
        return (overlap_start, overlap_end)
    return None

rows = []
for team, group in df.groupby("team_name"):
    players = group.to_dict("records")
    for p1, p2 in itertools.combinations(players, 2):
        result = overlap_years(p1["start_year"], p1["end_year"], p2["start_year"], p2["end_year"])
        if result:
            overlap_start, overlap_end = result
            overlap_range = f"{overlap_start}-{overlap_end}"
            rows.append((p1["player_id"], p2["player_id"], team, overlap_range))

pairs_path = os.path.join(os.getcwd(), "datasets", "teammates.csv")
pd.DataFrame(rows, columns=["player1", "player2", "team", "overlapping_years"]).to_csv(pairs_path, index=False)

print(f"Teammate pairs CSV saved to {pairs_path}")
print(f"Total teammate pairs: {len(rows):,}")
