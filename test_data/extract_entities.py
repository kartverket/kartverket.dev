#################################################
# Script to extract entities from the catalog
# To refresh org.yaml, delete the sqlites, sync the catalog with the microsoft provider, then run this script
#################################################


import sqlite3
import json
import yaml
import uuid
import random
from faker import Faker
import os

### GET THE DATA
database_path = '../db/catalog.sqlite'

connection = sqlite3.connect(database_path)
cursor = connection.cursor()

query = "SELECT final_entity FROM final_entities;"
cursor.execute(query)
results = cursor.fetchall()
connection.close()


### PROCESS THE DATA
faker = Faker()
users = []

def anonymize_user_data(user_data):
    first_name = faker.first_name()
    last_name = faker.last_name()
    # Replace identifiable information
    username = f"{first_name}.{last_name}_kartverket.dev"
    backstage_msgraph_uuid = f"msgraph:default/{str(uuid.uuid4())}"
    user_data['metadata']['annotations']['backstage.io/managed-by-location'] = backstage_msgraph_uuid
    user_data['metadata']['annotations']['backstage.io/managed-by-origin-location'] = backstage_msgraph_uuid
    user_data['metadata']['annotations']['graph.microsoft.com/user-id'] = str(uuid.uuid4())
    user_data['metadata']['annotations']['microsoft.com/email'] = f"{first_name}.{last_name}@kartverket.dev"
    user_data['metadata']['etag'] = str(uuid.uuid4())
    user_data['metadata']['name'] = username
    user_data['metadata']['uid'] = str(uuid.uuid4())
    user_data['spec']['profile']['displayName'] = f"{first_name} {last_name}"
    user_data['spec']['profile']['email'] = user_data['metadata']['annotations']['microsoft.com/email']
    user_data['spec']['profile']['picture'] = random.choice(['https://i.imgur.com/zcal7OY.jpeg', 'https://i.imgur.com/yWbRMvf.jpeg', 'https://i.imgur.com/eLRLYfw.jpeg', 'https://i.imgur.com/zpq5SeF.jpeg'])
    del user_data['relations']

def anonymize_group_data(group_data):
    backstage_msgraph_uuid = f"msgraph:default/{str(uuid.uuid4())}"
    group_data['metadata']['annotations']['backstage.io/managed-by-location'] = backstage_msgraph_uuid
    group_data['metadata']['annotations']['backstage.io/managed-by-origin-location'] = backstage_msgraph_uuid
    group_data['metadata']['annotations']['graph.microsoft.com/group-id'] = str(uuid.uuid4())
    group_data['metadata']['etag'] = str(uuid.uuid4())
    group_data['metadata']['uid'] = str(uuid.uuid4())
    del group_data['relations']

json_data_list = [json.loads(result[0]) for result in results]
users_and_groups = [data for data in json_data_list if data['kind'] in ['User', 'Group']]

for data in users_and_groups:
    if data['kind'] == 'User':
        data = anonymize_user_data(data)
    elif data['kind'] == 'Group':
        data = anonymize_group_data(data)


### WRITE THE DATA
with open('org.yaml', 'w') as outfile:
    for obj in users_and_groups:
        yaml.dump(obj, outfile, allow_unicode=True, default_flow_style=False)
        outfile.write('\n---\n')




